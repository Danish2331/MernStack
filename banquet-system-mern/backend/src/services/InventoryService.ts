import HallDayInventory, { IHallDayInventory } from '../models/HallDayInventory';
import TemporaryHold from '../models/TemporaryHold';
import mongoose from 'mongoose';

export class InventoryService {

  /**
   * Ensures the ledger exists for a given day. 
   * Call this when a user views a date or attempts to search.
   */
  static async initializeInventory(hallId: string, date: string): Promise<IHallDayInventory> {
    // Try to find existing first
    let inventory = await HallDayInventory.findOne({ hallId, date });
    
    if (!inventory) {
      // Create fresh inventory with 48 AVAILABLE slots
      const emptySlots = Array(48).fill(null).map((_, i) => ({
        index: i,
        status: 'AVAILABLE'
      }));

      try {
        inventory = await HallDayInventory.create({
          hallId,
          date,
          slots: emptySlots
        });
      } catch (error: any) {
        // Handle race condition where another request created it just now
        if (error.code === 11000) {
          inventory = await HallDayInventory.findOne({ hallId, date });
          if (!inventory) throw new Error('Failed to retrieve inventory after creation constraint conflict.');
        } else {
          throw error;
        }
      }
    }
    return inventory;
  }

  /**
   * The "Atomic Lock" Mechanism.
   * Attempts to flip status from AVAILABLE -> HELD for all requested slots in one atomic DB operation.
   */
  static async holdSlots(
    hallId: string, 
    date: string, 
    slotIndices: number[], 
    userId: string
  ): Promise<any> {
    
    // 1. Ensure Inventory Exists
    await this.initializeInventory(hallId, date);

    // 2. Construct Dynamic Atomic Query
    // We must ensure EVERY requested slot is currently 'AVAILABLE'
    const query: any = {
      hallId,
      date
    };
    
    // e.g., { "slots.20.status": "AVAILABLE", "slots.21.status": "AVAILABLE" }
    slotIndices.forEach(index => {
      query[`slots.${index}.status`] = 'AVAILABLE';
    });

    // 3. Construct Update Operation
    // Flip status to 'HELD' and assign user
    const update: any = {};
    slotIndices.forEach(index => {
      update[`slots.${index}.status`] = 'HELD';
      update[`slots.${index}.lockedBy`] = userId;
    });

    // 4. Execute Atomic Update
    const result = await HallDayInventory.findOneAndUpdate(
      query,
      { $set: update },
      { new: true } // Return the updated doc
    );

    if (!result) {
      // If null, it means the condition failed (one or more slots were NOT available)
      throw new Error(`Slots ${slotIndices.join(', ')} are no longer available.`);
    }

    // 5. Create the Temporary Hold Document (TTL)
    // This is the "Safety Net" that expires if booking isn't finalized
    const hold = await TemporaryHold.create({
      userId,
      hallId,
      date,
      slotIndices,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 Hours from now
    });

    return { inventory: result, holdId: hold._id };
  }

  /**
   * Releases slots (HELD -> AVAILABLE).
   * Used when Hold expires or Admin rejects.
   */
  static async releaseSlots(hallId: string, date: string, slotIndices: number[]): Promise<void> {
    const update: any = {};
    slotIndices.forEach(index => {
      update[`slots.${index}.status`] = 'AVAILABLE';
      update[`slots.${index}.lockedBy`] = null; // Unset the locker
    });

    // We don't strictly enforce "HELD" status here to be safe (idempotent release)
    // But we should target the specific hall/date
    await HallDayInventory.updateOne(
      { hallId, date },
      { $set: update }
    );
  }

  /**
   * Confirms a booking (HELD -> BOOKED).
   * Used when Admin 3 gives final approval.
   */
  static async confirmBooking(hallId: string, date: string, slotIndices: number[]): Promise<void> {
    const update: any = {};
    slotIndices.forEach(index => {
      update[`slots.${index}.status`] = 'BOOKED';
    });

    await HallDayInventory.updateOne(
      { hallId, date },
      { $set: update }
    );
  }
}
