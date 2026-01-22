import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 0. Create Demo Business
  const business = await prisma.business.create({
    data: {
      name: "Demo Catering Services",
      ownerName: "Admin User",
      phone: "9999999999",
      email: "admin@testfulaffaire.com",
    }
  });

  console.log(`Created Demo Business with ID: ${business.id}`);

  // 1. Create Default Global Settings
  await prisma.globalSettings.create({
    data: {
        businessId: business.id,
        companyName: "Demo Catering Services",
        contactPhone: "9999999999",
        contactEmail: "admin@testfulaffaire.com",
    }
  });

  // 1.5. Create Admin User linked to Business
  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      phone: "9999999999",
      password: hashedAdminPassword,
      name: "Admin User",
      email: "admin@testfulaffaire.com",
      role: "ADMIN",
      businessId: business.id,
    },
  });
  console.log("Created Admin User (Phone: 9999999999, Password: admin123)");

  // 2. Create Staff
  const staffMembers = await Promise.all([
    prisma.staff.create({
      data: {
        name: "Ramesh Maharaj",
        role: "Head Chef",
        phone: "9876543210",
        businessId: business.id,
      },
    }),
    prisma.staff.create({
      data: {
        name: "Suresh Helper",
        role: "Helper",
        phone: "9876543211",
        businessId: business.id,
      },
    }),
    prisma.staff.create({
      data: {
        name: "Mahesh Manager",
        role: "Manager",
        phone: "9876543212",
        businessId: business.id,
      },
    }),
  ]);

  console.log(`Created ${staffMembers.length} staff members`);

  // 3. Create Customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: "Rajesh Patel",
        email: "rajesh.patel@example.com",
        phone: "9825012345",
        address: "12, Gokuldham Society, Ahmedabad",
        businessId: business.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Amit Shah",
        email: "amit.shah@example.com",
        phone: "9825012346",
        address: "45, Satellite Road, Ahmedabad",
        businessId: business.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Priya Desai",
        email: "priya.desai@example.com",
        phone: "9825012347",
        address: "B-202, Shivranjani Apts, Vadodara",
        businessId: business.id,
      },
    }),
  ]);

  console.log(`Created ${customers.length} customers`);

  // 4. Create Menu Categories & Items
  const categories = [
    {
      name: "Farsan (Starters)",
      items: [
        { name: "Nylon Khaman", price: 40, description: "Soft and spongy steamed gram flour cakes" },
        { name: "Sandwich Dhokla", price: 50, description: "Layered dhokla with green chutney" },
        { name: "Patra", price: 60, description: "Colocasia leaves rolled with spices" },
        { name: "Lilva Kachori", price: 45, description: "Crispy balls stuffed with pigeon peas" },
        { name: "Handvo", price: 70, description: "Savory vegetable cake" },
      ],
    },
    {
      name: "Sabzi (Main Course)",
      items: [
        { name: "Undhiyu", price: 120, description: "Mixed vegetable casserole, a winter specialty" },
        { name: "Sev Tameta", price: 90, description: "Spicy tomato curry with sev" },
        { name: "Bhinda Sambhariya", price: 100, description: "Stuffed okra curry" },
        { name: "Aloo Rasawala", price: 80, description: "Potato curry in gravy" },
        { name: "Desi Chana", price: 95, description: "Black chickpeas curry" },
      ],
    },
    {
      name: "Breads (Roti/Puri)",
      items: [
        { name: "Phulka Roti", price: 10, description: "Soft thin wheat flour bread" },
        { name: "Puri", price: 15, description: "Deep fried wheat flour bread" },
        { name: "Methi Thepla", price: 20, description: "Fenugreek spiced flatbread" },
        { name: "Bajra Rotla", price: 25, description: "Millet flour flatbread" },
      ],
    },
    {
      name: "Rice & Dal",
      items: [
        { name: "Gujarati Dal", price: 60, description: "Sweet and sour lentil soup" },
        { name: "Steamed Rice", price: 50, description: "Basmati rice" },
        { name: "Masala Khichdi", price: 80, description: "Spiced rice and lentil porridge" },
        { name: "Kadhi", price: 60, description: "Yogurt based curry" },
      ],
    },
    {
      name: "Mithai (Sweets)",
      items: [
        { name: "Kesar Shrikhand", price: 150, description: "Saffron flavored strained yogurt" },
        { name: "Gulab Jamun", price: 100, description: "Deep fried milk solids in sugar syrup" },
        { name: "Mohanthal", price: 180, description: "Gram flour fudge" },
        { name: "Basundi", price: 160, description: "Thickened sweetened milk" },
        { name: "Jalebi", price: 120, description: "Crispy orange spirals in syrup" },
      ],
    },
    {
      name: "Beverages",
      items: [
        { name: "Masala Chaas", price: 20, description: "Spiced buttermilk" },
        { name: "Mango Lassi", price: 50, description: "Sweet yogurt drink with mango pulp" },
      ],
    },
  ];

  for (const cat of categories) {
    const createdCat = await prisma.menuCategory.create({
      data: { 
          name: cat.name,
          businessId: business.id
      },
    });

    for (const item of cat.items) {
      await prisma.menuItem.create({
        data: {
          name: item.name,
          price: item.price,
          description: item.description,
          categoryId: createdCat.id,
          available: true,
        },
      });
    }
  }

  console.log("Created Menu Categories and Items");

  // 5. Create Packages
  const packages = [
    {
      name: "Standard Gujarati Thali",
      description: "Perfect for small gatherings and corporate lunches.",
      price: 250,
      features: JSON.stringify([
        "1 Farsan",
        "2 Sabzi",
        "Roti & Puri",
        "Dal & Rice",
        "1 Sweet",
        "Papad, Pickle, Salad",
        "Buttermilk",
      ]),
      tag: "Popular",
    },
    {
      name: "Premium Wedding Feast",
      description: "A grand spread for weddings and receptions.",
      price: 550,
      features: JSON.stringify([
        "2 Farsan",
        "3 Sabzi (inc. Undhiyu)",
        "Roti, Puri & Bajra Rotla",
        "Dal, Kadhi & Pulav",
        "2 Sweets (inc. Seasonal)",
        "Live Counter (Dhokla/Pasta)",
        "Soup & Welcome Drink",
        "Mukhwas & Pan",
      ]),
      tag: "Luxury",
    },
    {
      name: "Budget Meal Box",
      description: "Economical packed lunch for events.",
      price: 150,
      features: JSON.stringify([
        "1 Sabzi",
        "5 Roti",
        "Dal Rice",
        "Pickle",
      ]),
      tag: "Budget",
    },
  ];

  for (const pkg of packages) {
    await prisma.package.create({
      data: {
          ...pkg,
          businessId: business.id
      },
    });
  }

  console.log("Created Packages");

  // 6. Create Events
  const today = new Date();
  
  // Past Event
  await prisma.event.create({
    data: {
      name: "Patel Engagement",
      date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      location: "Grand Bhagwati, SG Highway",
      type: "Engagement",
      time: "11:00 AM",
      status: "COMPLETED",
      customerId: customers[0].id, // Rajesh Patel
      businessId: business.id,
      staff: {
        create: [
          { staffId: staffMembers[0].id }, // Chef
          { staffId: staffMembers[1].id }, // Helper
        ],
      },
    },
  });

  // Upcoming Event 1
  await prisma.event.create({
    data: {
      name: "Shah Wedding Reception",
      date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days later
      location: "Karnavati Club",
      type: "Wedding",
      time: "07:00 PM",
      status: "UPCOMING",
      customerId: customers[1].id, // Amit Shah
      businessId: business.id,
      staff: {
        create: [
          { staffId: staffMembers[0].id },
          { staffId: staffMembers[2].id },
        ],
      },
    },
  });

  // Upcoming Event 2
  await prisma.event.create({
    data: {
      name: "Birthday Party",
      date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days later
      location: "Science City Road",
      type: "Birthday",
      time: "06:00 PM",
      status: "UPCOMING",
      customerId: customers[2].id, // Priya Desai
      businessId: business.id,
    },
  });

   // New Inquiry
   await prisma.contactInquiry.create({
    data: {
      name: "Vikram Chaudhari",
      email: "vikram@gmail.com",
      phone: "9998877665",
      eventType: "Corporate Dinner",
      guestCount: 150,
      eventDate: "2024-12-25",
      venueLocation: "GIFT City",
      message: "Need a pure veg premium menu quotation.",
      status: "NEW",
      businessId: business.id,
    }
   });

  console.log("Created Events and Inquiries");
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
