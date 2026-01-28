import mongoose from 'mongoose';
import Hall from '../src/models/Hall';

const fixVenues = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/banquet_db');
        console.log('✅ Connected to MongoDB');

        console.log('🗑️  Wiping Halls...');
        await Hall.deleteMany({});

        console.log('🏛️  Seeding Venues...');
        const venues = [
            {
                name: "La Grace Gold Ballroom",
                type: "Gold",
                capacity: 500,
                price: 150000,
                panoramaUrl: "https://www.youtube.com/watch?v=K17xfqib0rE",
                amenities: ["AC", "Stage", "Projector"]
            },
            {
                name: "La Grace Diamond Royal",
                type: "Diamond",
                capacity: 1000,
                price: 300000,
                panoramaUrl: "https://www.youtube.com/watch?v=1duOT5_oPPk",
                amenities: ["AC", "Stage", "Projector", "Valet"]
            },
            {
                name: "La Grace Silver Lounge",
                type: "Silver",
                capacity: 200,
                price: 50000,
                panoramaUrl: "https://www.youtube.com/watch?v=u_oGdhxqits",
                amenities: ["AC"]
            }
        ];

        await Hall.insertMany(venues);
        console.log('✅ Venues Reseeded Successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Failed:', error);
        process.exit(1);
    }
};

fixVenues();
