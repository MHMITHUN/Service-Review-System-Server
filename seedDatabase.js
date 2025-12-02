import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        deprecationErrors: true,
    }
});

// Bangladeshi services data with local context
const services = [
    {
        title: "Professional Web Development",
        company: "BdTech Solutions Ltd",
        website: "https://bdtechsolutions.com.bd",
        description: "পেশাদার ওয়েব ডেভেলপমেন্ট সার্ভিস। React, Node.js এবং MongoDB দিয়ে আধুনিক ওয়েবসাইট তৈরি করি। আপনার ব্যবসার জন্য সম্পূর্ণ কাস্টম সলিউশন।",
        category: "IT",
        price: 45000,
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
        userEmail: "karim@bdtech.com.bd",
        addedDate: new Date("2024-01-15"),
        createdAt: new Date("2024-01-15")
    },
    {
        title: "Cloud Server Management",
        company: "DataCare Bangladesh",
        website: "https://datacare.com.bd",
        description: "ক্লাউড সার্ভার সেটআপ এবং ম্যানেজমেন্ট সার্ভিস। AWS, Google Cloud এবং Azure এর উপর দক্ষতা। ২৪/৭ সাপোর্ট এবং সিকিউরিটি নিশ্চিত।",
        category: "IT",
        price: 35000,
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
        userEmail: "admin@datacare.com.bd",
        addedDate: new Date("2024-01-20"),
        createdAt: new Date("2024-01-20")
    },
    {
        title: "Wedding Catering Service",
        company: "Royal Kitchen Dhaka",
        website: "https://royalkitchen.com.bd",
        description: "বিয়ে এবং সামাজিক অনুষ্ঠানের জন্য সম্পূর্ণ ক্যাটারিং সার্ভিস। বাংলাদেশী ও আন্তর্জাতিক খাবারের বিশাল মেনু। ১০০-১০০০ জন পর্যন্ত ব্যবস্থা।",
        category: "Food",
        price: 500,
        imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop",
        userEmail: "info@royalkitchen.com.bd",
        addedDate: new Date("2024-02-01"),
        createdAt: new Date("2024-02-01")
    },
    {
        title: "AC Car Rental Service",
        company: "Dhaka Ride Transport",
        website: "https://dhakaride.com.bd",
        description: "ঢাকা এবং সারাদেশে AC গাড়ি ভাড়া সেবা। বিয়ে, পিকনিক, অফিস ট্রিপ সব অনুষ্ঠানের জন্য। দক্ষ ড্রাইভার সহ।",
        category: "Transport",
        price: 3500,
        imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        userEmail: "booking@dhakaride.com.bd",
        addedDate: new Date("2024-02-05"),
        createdAt: new Date("2024-02-05")
    },
    {
        title: "Digital Marketing Package",
        company: "AdBuzz Bangladesh",
        website: "https://adbuzz.com.bd",
        description: "সম্পূর্ণ ডিজিটাল মার্কেটিং সলিউশন। Facebook, Instagram, Google Ads ম্যানেজমেন্ট। SEO এবং কন্টেন্ট মার্কেটিং।",
        category: "IT",
        price: 25000,
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
        userEmail: "hello@adbuzz.com.bd",
        addedDate: new Date("2024-02-10"),
        createdAt: new Date("2024-02-10")
    },
    {
        title: "Full Body Health Checkup",
        company: "LabAid Diagnostics",
        website: "https://labaid.com.bd",
        description: "সম্পূর্ণ শরীর পরীক্ষা প্যাকেজ। ৫০+ টেস্ট অন্তর্ভুক্ত। অভিজ্ঞ ডাক্তার দ্বারা রিপোর্ট ব্যাখ্যা। বাড়িতে স্যাম্পল কালেকশন সুবিধা।",
        category: "Healthcare",
        price: 5500,
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
        userEmail: "contact@labaid.com.bd",
        addedDate: new Date("2024-02-15"),
        createdAt: new Date("2024-02-15")
    },
    {
        title: "Web Development Bootcamp",
        company: "Code Academy BD",
        website: "https://codeacademy.com.bd",
        description: "৬ মাসের সম্পূর্ণ ওয়েব ডেভেলপমেন্ট কোর্স। HTML, CSS, JavaScript, React, Node.js শেখানো হয়। চাকরির নিশ্চয়তা সহ।",
        category: "Education",
        price: 35000,
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
        userEmail: "admission@codeacademy.com.bd",
        addedDate: new Date("2024-02-20"),
        createdAt: new Date("2024-02-20")
    },
    {
        title: "Investment Consultation",
        company: "WealthWise BD",
        website: "https://wealthwise.com.bd",
        description: "বিনিয়োগ পরামর্শ সেবা। শেয়ার মার্কেট, মিউচুয়াল ফান্ড, সঞ্চয়পত্র - সব বিষয়ে বিশেষজ্ঞ পরামর্শ। আর্থিক পরিকল্পনা তৈরি।",
        category: "Finance",
        price: 10000,
        imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
        userEmail: "consult@wealthwise.com.bd",
        addedDate: new Date("2024-02-25"),
        createdAt: new Date("2024-02-25")
    },
    {
        title: "Tiffin Service - Homemade Food",
        company: "Maa'r Ranna Tiffin",
        website: "https://maarranna.com.bd",
        description: "ঘরে তৈরি স্বাস্থ্যকর খাবার ডেলিভারি। প্রতিদিন তাজা রান্না। মাসিক প্যাকেজ উপলব্ধ। ঢাকার সব এলাকায় ডেলিভারি।",
        category: "Food",
        price: 4500,
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
        userEmail: "order@maarranna.com.bd",
        addedDate: new Date("2024-03-01"),
        createdAt: new Date("2024-03-01")
    },
    {
        title: "Cybersecurity Solutions",
        company: "SecureNet Bangladesh",
        website: "https://securenet.com.bd",
        description: "কম্পিউটার এবং নেটওয়ার্ক সিকিউরিটি সার্ভিস। ভাইরাস প্রোটেকশন, ফায়ারওয়াল সেটআপ, ডেটা এনক্রিপশন। ২৪/৭ মনিটরিং।",
        category: "IT",
        price: 28000,
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop",
        userEmail: "security@securenet.com.bd",
        addedDate: new Date("2024-03-05"),
        createdAt: new Date("2024-03-05")
    }
];

// Bangladeshi reviews with local names
const reviews = [
    {
        serviceId: null,
        serviceTitle: "Professional Web Development",
        rating: 5,
        reviewText: "অসাধারণ সার্ভিস! আমাদের কোম্পানির ওয়েবসাইট খুবই সুন্দর এবং দ্রুত হয়েছে। BdTech Solutions এর টিম অত্যন্ত পেশাদার। সবাইকে সুপারিশ করছি।",
        userEmail: "rahman@example.com",
        userName: "আব্দুর রহমান",
        userPhoto: "https://i.pravatar.cc/150?img=12",
        postedDate: new Date("2024-01-25").toISOString(),
        createdAt: new Date("2024-01-25")
    },
    {
        serviceId: null,
        serviceTitle: "Professional Web Development",
        rating: 5,
        reviewText: "খুবই ভালো কাজ করেছে। সময়মতো কাজ শেষ করেছে এবং সাপোর্টও দিচ্ছে। দাম অনুযায়ী সেরা সার্ভিস।",
        userEmail: "fatima@example.com",
        userName: "ফাতিমা সুলতানা",
        userPhoto: "https://i.pravatar.cc/150?img=45",
        postedDate: new Date("2024-01-28").toISOString(),
        createdAt: new Date("2024-01-28")
    },
    {
        serviceId: null,
        serviceTitle: "Cloud Server Management",
        rating: 5,
        reviewText: "DataCare Bangladesh সত্যিই দক্ষ। আমাদের সার্ভার এখন খুব দ্রুত চলছে এবং কোনো ডাউনটাইম নেই। ২৪/৭ সাপোর্ট পাই যা খুবই গুরুত্বপূর্ণ।",
        userEmail: "kamal@example.com",
        userName: "কামাল হোসেন",
        userPhoto: "https://i.pravatar.cc/150?img=33",
        postedDate: new Date("2024-02-05").toISOString(),
        createdAt: new Date("2024-02-05")
    },
    {
        serviceId: null,
        serviceTitle: "Wedding Catering Service",
        rating: 5,
        reviewText: "আমার বিয়েতে Royal Kitchen এর খাবার সবাই পছন্দ করেছে। খাবারের মান এবং পরিবেশনা দুটোই চমৎকার ছিল। ধন্যবাদ!",
        userEmail: "nusrat@example.com",
        userName: "নুসরাত জাহান",
        userPhoto: "https://i.pravatar.cc/150?img=28",
        postedDate: new Date("2024-02-10").toISOString(),
        createdAt: new Date("2024-02-10")
    },
    {
        serviceId: null,
        serviceTitle: "Digital Marketing Package",
        rating: 4,
        reviewText: "AdBuzz এর মাধ্যমে আমার ব্যবসায় অনলাইন কাস্টমার ৩ গুণ বেড়েছে। Facebook Ads এবং Google Ads দুটোই ভালো রেজাল্ট দিচ্ছে।",
        userEmail: "habib@example.com",
        userName: "হাবিবুর রহমান",
        userPhoto: "https://i.pravatar.cc/150?img=52",
        postedDate: new Date("2024-02-20").toISOString(),
        createdAt: new Date("2024-02-20")
    },
    {
        serviceId: null,
        serviceTitle: "Web Development Bootcamp",
        rating: 5,
        reviewText: "জীবন বদলে দেওয়া কোর্স! ৬ মাসে আমি ওয়েব ডেভেলপার হয়ে গেছি এবং চাকরি পেয়ে গেছি। Code Academy BD এর শিক্ষকরা অসাধারণ!",
        userEmail: "sakib@example.com",
        userName: "সাকিব আহমেদ",
        userPhoto: "https://i.pravatar.cc/150?img=16",
        postedDate: new Date("2024-03-10").toISOString(),
        createdAt: new Date("2024-03-10")
    },
    {
        serviceId: null,
        serviceTitle: "AC Car Rental Service",
        rating: 5,
        reviewText: "পরিবারের সাথে কক্সবাজার ট্রিপে Dhaka Ride এর গাড়ি নিয়েছিলাম। ড্রাইভার খুব ভদ্র এবং গাড়ি পরিষ্কার ছিল। দাম ও রিজনেবল।",
        userEmail: "rahim@example.com",
        userName: "মোঃ রহিম উদ্দিন",
        userPhoto: "https://i.pravatar.cc/150?img=68",
        postedDate: new Date("2024-02-18").toISOString(),
        createdAt: new Date("2024-02-18")
    },
    {
        serviceId: null,
        serviceTitle: "Full Body Health Checkup",
        rating: 5,
        reviewText: "LabAid এর সার্ভিস অত্যন্ত ভালো। রিপোর্ট তাড়াতাড়ি পেয়েছি এবং ডাক্তার সব কিছু ভালো করে বুঝিয়ে দিয়েছেন।",
        userEmail: "rehana@example.com",
        userName: "রেহানা খাতুন",
        userPhoto: "https://i.pravatar.cc/150?img=23",
        postedDate: new Date("2024-02-22").toISOString(),
        createdAt: new Date("2024-02-22")
    }
];

async function seedDatabase() {
    try {
        await client.connect();
        console.log('🔗 Connected to MongoDB!');

        const db = client.db('service-review');
        const servicesCollection = db.collection('services');
        const reviewsCollection = db.collection('reviews');

        // Clear existing data
        await servicesCollection.deleteMany({});
        await reviewsCollection.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Insert services
        const serviceResult = await servicesCollection.insertMany(services);
        console.log(`✅ Inserted ${serviceResult.insertedCount} Bangladeshi services`);

        // Get inserted service IDs and update reviews
        const insertedServices = await servicesCollection.find({}).toArray();
        const serviceMap = {};
        insertedServices.forEach(service => {
            serviceMap[service.title] = service._id.toString();
        });

        // Update reviews with correct service IDs
        reviews.forEach(review => {
            review.serviceId = serviceMap[review.serviceTitle];
        });

        // Insert reviews
        const reviewResult = await reviewsCollection.insertMany(reviews);
        console.log(`✅ Inserted ${reviewResult.insertedCount} Bangladeshi reviews`);

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎉 Database Seeded Successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📊 Services: ${serviceResult.insertedCount}`);
        console.log(`💬 Reviews: ${reviewResult.insertedCount}`);
        console.log(`🇧🇩 Context: Bangladeshi`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await client.close();
        console.log('\n✅ Database connection closed');
    }
}

seedDatabase();
