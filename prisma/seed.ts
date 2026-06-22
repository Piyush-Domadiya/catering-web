import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 0. Create Demo Business
  const business = await prisma.business.upsert({
    where: { id: "demo-business-id" }, // Using a fixed ID for idempotency or finding by unique field if possible. But Business has no unique name.
    // Actually, let's find the first business or create one.
    update: {},
    create: {
      id: "demo-business-id", // Force ID for easy reference
      name: "Demo Catering Services",
      ownerName: "Admin User",
      phone: "9999999999",
      email: "admin@tastefulaffaire.com",
    }
  });

  console.log(`Created Demo Business with ID: ${business.id}`);

  // 1. Create Default Global Settings
  await prisma.globalSettings.upsert({
    where: { businessId: business.id },
    update: {},
    create: {
        businessId: business.id,
        companyName: "Demo Catering Services",
        contactPhone: "9999999999",
        contactEmail: "admin@tastefulaffaire.com",
    }
  });

  // 1.5. Create Admin User linked to Business
  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { phone: "9999999999" },
    update: {},
    create: {
      phone: "9999999999",
      password: hashedAdminPassword,
      name: "Admin User",
      email: "admin@tastefulaffaire.com",
      role: "ADMIN",
      businessId: business.id,
    },
  });
  console.log("Created/Updated Admin User (Phone: 9999999999, Password: admin123)");

  // 2. Create Staff
  const staffData = [
    { name: "Ramesh Maharaj", role: "Head Chef", phone: "9876543210" },
    { name: "Suresh Helper", role: "Helper", phone: "9876543211" },
    { name: "Mahesh Manager", role: "Manager", phone: "9876543212" },
  ];

  const staffMembers = [];
  for (const s of staffData) {
    let staff = await prisma.staff.findFirst({
      where: { name: s.name, businessId: business.id }
    });
    if (!staff) {
      staff = await prisma.staff.create({
        data: { ...s, businessId: business.id }
      });
    }
    staffMembers.push(staff);
  }

  console.log(`Created ${staffMembers.length} staff members`);

  // 3. Create Customers
  const customerData = [
    { name: "Rajesh Patel", email: "rajesh.patel@example.com", phone: "9825012345", address: "12, Gokuldham Society, Ahmedabad" },
    { name: "Amit Shah", email: "amit.shah@example.com", phone: "9825012346", address: "45, Satellite Road, Ahmedabad" },
    { name: "Priya Desai", email: "priya.desai@example.com", phone: "9825012347", address: "B-202, Shivranjani Apts, Vadodara" },
  ];

  const customers = [];
  for (const c of customerData) {
    let customer = await prisma.customer.upsert({
      where: { email_businessId: { email: c.email, businessId: business.id } },
      update: {},
      create: { ...c, businessId: business.id }
    });
    customers.push(customer);
  }

  console.log(`Created ${customers.length} customers`);

  // 3.5 Create User accounts for Customers (so they can login)
  const customerPassword = await bcrypt.hash("customer123", 10);
  for (const customer of customers) {
    if (customer) { // Ensure customer object exists
        await prisma.user.upsert({
            where: { phone: customer.phone },
            update: {},
            create: {
            phone: customer.phone,
            password: customerPassword,
            name: customer.name,
            email: customer.email,
            role: "CUSTOMER", 
            businessId: business.id,
            },
        });
    }
  }
  console.log("Created/Updated User accounts for customers (Password: customer123)");

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
    // Find or create category - using business-specific search
    let createdCat = await prisma.menuCategory.findFirst({
      where: {
        name: cat.name,
        businessId: business.id
      }
    });

    if (!createdCat) {
      createdCat = await prisma.menuCategory.create({
        data: {
          name: cat.name,
          businessId: business.id
        },
      });
      console.log(`Created Category: ${cat.name}`);
    } else {
      console.log(`Using existing Category: ${cat.name}`);
    }

    for (const item of cat.items) {
      // Find or create item within this category
      const existingItem = await prisma.menuItem.findFirst({
        where: {
          name: item.name,
          categoryId: createdCat.id
        }
      });

      if (!existingItem) {
        await prisma.menuItem.create({
          data: {
            name: item.name,
            price: item.price,
            description: item.description,
            categoryId: createdCat.id,
            available: true,
          },
        });
        console.log(`  Added item: ${item.name}`);
      }
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
    const existingPkg = await prisma.package.findFirst({
      where: { name: pkg.name, businessId: business.id }
    });
    if (!existingPkg) {
      await prisma.package.create({
        data: {
            ...pkg,
            businessId: business.id
        },
      });
    }
  }

  console.log("Created Packages");

  // 6. Create Events
  const today = new Date();
  
  // Past Event
  const pastEvent = await prisma.event.findFirst({
    where: { name: "Patel Engagement", businessId: business.id }
  });
  if (!pastEvent) {
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
  }

  // Upcoming Event 1
  const weddingEvent = await prisma.event.findFirst({
    where: { name: "Shah Wedding Reception", businessId: business.id }
  });
  if (!weddingEvent) {
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
  }

  // Upcoming Event 2
  const birthdayEvent = await prisma.event.findFirst({
    where: { name: "Birthday Party", businessId: business.id }
  });
  if (!birthdayEvent) {
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
  }

   // New Inquiry
   const existingInquiry = await prisma.contactInquiry.findFirst({
    where: { name: "Vikram Chaudhari", email: "vikram@gmail.com", businessId: business.id }
   });
   if (!existingInquiry) {
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
   }

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
