const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash("Admin@123", 12);
    const admin = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        username: "admin",
        email: "admin@example.com",
        password: adminPassword,
        role: "admin",
        isActive: true,
      },
    });
    console.log("✅ Admin user created:", admin.email);

    // Create categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: "technology" },
        update: {},
        create: {
          name: "Technology",
          slug: "technology",
          description: "Latest tech gadgets and reviews",
        },
      }),
      prisma.category.upsert({
        where: { slug: "home-garden" },
        update: {},
        create: {
          name: "Home & Garden",
          slug: "home-garden",
          description: "Home improvement and garden products",
        },
      }),
      prisma.category.upsert({
        where: { slug: "sports-outdoors" },
        update: {},
        create: {
          name: "Sports & Outdoors",
          slug: "sports-outdoors",
          description: "Sports equipment and outdoor gear",
        },
      }),
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // Create tags
    const tags = await Promise.all([
      prisma.tag.upsert({
        where: { slug: "bestseller" },
        update: {},
        create: {
          name: "Bestseller",
          slug: "bestseller",
        },
      }),
      prisma.tag.upsert({
        where: { slug: "budget-friendly" },
        update: {},
        create: {
          name: "Budget Friendly",
          slug: "budget-friendly",
        },
      }),
      prisma.tag.upsert({
        where: { slug: "premium" },
        update: {},
        create: {
          name: "Premium",
          slug: "premium",
        },
      }),
    ]);
    console.log(`✅ Created ${tags.length} tags`);

    // Create blog posts
    const blogPosts = await Promise.all([
      prisma.blogPost.upsert({
        where: { slug: "top-5-tech-gadgets-2025" },
        update: {},
        create: {
          title: "Top 5 Tech Gadgets for 2025",
          slug: "top-5-tech-gadgets-2025",
          content: `
            In this comprehensive review, we explore the 5 best tech gadgets that will revolutionize your daily life in 2025.
            
            **Affiliate Disclosure**: This page contains affiliate links. We may earn a commission if you click and purchase.
            
            ## 1. Smart Home Hub Pro
            The latest smart home hub offers unmatched compatibility and ease of use.
            
            ## 2. Wireless Earbuds X3
            Experience crystal-clear audio with adaptive noise cancellation.
            
            ## 3. Portable Phone Charger 20000mAh
            Never worry about battery life again with our recommended power banks.
            
            [Buy on Amazon](https://amazon.com/example)
          `,
          excerpt:
            "Discover the top 5 tech gadgets that will transform your 2025. Expert reviews and buying guides inside.",
          status: "published",
          authorId: admin.id,
          categoryId: categories[0].id,
          publishedAt: new Date(),
          views: 150,
        },
      }),
      prisma.blogPost.upsert({
        where: { slug: "home-garden-tips-beginners" },
        update: {},
        create: {
          title: "Home Garden Tips for Beginners",
          slug: "home-garden-tips-beginners",
          content: `
            Starting a home garden doesn't have to be complicated. Follow these simple steps to get started.
            
            **Affiliate Disclosure**: We recommend products we've tested and love. Learn about our affiliate partnerships.
            
            ## Getting Started
            - Choose the right location
            - Prepare your soil
            - Select easy-to-grow plants
            
            ## Essential Tools
            Check out our recommended gardening tools and supplies on Amazon.
          `,
          excerpt: "Learn how to start your home garden with our beginner-friendly guide.",
          status: "published",
          authorId: admin.id,
          categoryId: categories[1].id,
          publishedAt: new Date(),
          views: 320,
        },
      }),
      prisma.blogPost.upsert({
        where: { slug: "best-outdoor-hiking-gear" },
        update: {},
        create: {
          title: "Best Outdoor Hiking Gear 2025",
          slug: "best-outdoor-hiking-gear",
          content: `
            Planning a hiking adventure? Read our complete guide to the best hiking gear available.
            
            **Affiliate Disclosure**: This content contains affiliate links. Your purchases support our site.
            
            ## Essential Hiking Gear
            - Quality hiking boots
            - Weather-appropriate clothing
            - Reliable backpack
            - Navigation tools
            
            Shop all recommended items on Amazon with our affiliate links.
          `,
          excerpt: "Complete guide to choosing the best hiking gear for your outdoor adventures.",
          status: "published",
          authorId: admin.id,
          categoryId: categories[2].id,
          publishedAt: new Date(),
          views: 240,
        },
      }),
    ]);
    console.log(`✅ Created ${blogPosts.length} blog posts`);

    // Connect tags to posts
    await prisma.blogPost.update({
      where: { id: blogPosts[0].id },
      data: {
        tags: {
          connect: [{ id: tags[0].id }, { id: tags[2].id }],
        },
      },
    });

    // Create products
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: "Smart Home Hub Pro",
          slug: "smart-home-hub-pro",
          description:
            "Advanced smart home hub with support for 100+ devices. Control your entire home from your smartphone.",
          price: 99.99,
          originalPrice: 149.99,
          brand: "TechVision",
          quantity: 45,
          sku: "SHH-PRO-001",
          status: "active",
          featured: true,
          metaTitle: "Smart Home Hub Pro - Control Your Home",
          metaDescription:
            "Advanced smart home hub supporting 100+ devices. Buy now on Amazon with our affiliate link.",
          amazonLink: "https://amazon.com/s?k=smart-home-hub",
          affiliateNote:
            "As an Amazon Associate, we earn from qualifying purchases.",
          categoryId: categories[0].id,
          averageRating: 4.5,
          reviewCount: 128,
        },
      }),
      prisma.product.create({
        data: {
          name: "Wireless Earbuds X3",
          slug: "wireless-earbuds-x3",
          description:
            "Premium wireless earbuds with active noise cancellation and 8-hour battery life.",
          price: 79.99,
          originalPrice: 119.99,
          brand: "AudioMax",
          quantity: 120,
          sku: "WE-X3-002",
          status: "active",
          featured: true,
          metaTitle: "Wireless Earbuds X3 - Best Budget ANC Earbuds",
          metaDescription:
            "Premium wireless earbuds with ANC and 8-hour battery. Find the best price on Amazon.",
          amazonLink: "https://amazon.com/s?k=wireless+earbuds+noise+cancelling",
          affiliateNote:
            "We earn a commission from Amazon purchases via affiliate links.",
          categoryId: categories[0].id,
          averageRating: 4.7,
          reviewCount: 256,
        },
      }),
      prisma.product.create({
        data: {
          name: "Professional Gardening Tool Set",
          slug: "professional-gardening-tool-set",
          description:
            "Complete 12-piece gardening tool set with ergonomic handles and stainless steel construction.",
          price: 49.99,
          originalPrice: 79.99,
          brand: "GreenThumb",
          quantity: 85,
          sku: "GT-SET-003",
          status: "active",
          featured: true,
          metaTitle: "Professional Gardening Tool Set - 12 Pieces",
          metaDescription:
            "Complete gardening tool set with ergonomic handles. Great for beginners and professionals.",
          amazonLink: "https://amazon.com/s?k=gardening+tools+set",
          affiliateNote: "Amazon affiliate disclosure included.",
          categoryId: categories[1].id,
          averageRating: 4.3,
          reviewCount: 89,
        },
      }),
      prisma.product.create({
        data: {
          name: "Portable Hiking Backpack 50L",
          slug: "portable-hiking-backpack-50l",
          description:
            "Durable 50-liter hiking backpack with rain cover, hydration bladder compatibility, and ergonomic design.",
          price: 89.99,
          originalPrice: 129.99,
          brand: "TrailMaster",
          quantity: 60,
          sku: "HB-50L-004",
          status: "active",
          featured: true,
          metaTitle: "50L Hiking Backpack - Perfect for Long Treks",
          metaDescription:
            "Professional-grade 50L hiking backpack with rain cover. Best for backpacking adventures.",
          amazonLink: "https://amazon.com/s?k=50+liter+hiking+backpack",
          affiliateNote: "Supporting our site through Amazon affiliate links.",
          categoryId: categories[2].id,
          averageRating: 4.6,
          reviewCount: 142,
        },
      }),
      prisma.product.create({
        data: {
          name: "Portable Phone Charger 20000mAh",
          slug: "portable-phone-charger-20000mah",
          description:
            "Fast-charging 20000mAh portable power bank with dual USB-C ports and LED display.",
          price: 34.99,
          originalPrice: 49.99,
          brand: "PowerPulse",
          quantity: 200,
          sku: "PC-20K-005",
          status: "active",
          featured: false,
          metaTitle: "20000mAh Portable Charger - Fast Charging",
          metaDescription:
            "High-capacity portable charger with dual USB-C. Never run out of battery again.",
          amazonLink: "https://amazon.com/s?k=20000mah+power+bank",
          affiliateNote: "Amazon affiliate recommendations for tech enthusiasts.",
          categoryId: categories[0].id,
          averageRating: 4.4,
          reviewCount: 340,
        },
      }),
    ]);
    console.log(`✅ Created ${products.length} products`);

    // Connect tags to products
    await prisma.product.update({
      where: { id: products[0].id },
      data: {
        tags: {
          connect: [{ id: tags[0].id }, { id: tags[2].id }],
        },
      },
    });

    await prisma.product.update({
      where: { id: products[4].id },
      data: {
        tags: {
          connect: [{ id: tags[1].id }],
        },
      },
    });

    // Add sample reviews
    await Promise.all([
      prisma.review.create({
        data: {
          rating: 5,
          comment: "Excellent product! Works perfectly with my smart home setup.",
          productId: products[0].id,
        },
      }),
      prisma.review.create({
        data: {
          rating: 4,
          comment: "Good value for money. Battery lasts longer than expected.",
          productId: products[1].id,
        },
      }),
      prisma.review.create({
        data: {
          rating: 5,
          comment: "High quality tools. Perfect for my gardening projects.",
          productId: products[2].id,
        },
      }),
    ]);
    console.log("✅ Added product reviews");

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📝 Sample Data:");
    console.log("- Admin Email: admin@example.com");
    console.log("- Admin Password: Admin@123");
    console.log("- Categories: 3");
    console.log("- Blog Posts: 3");
    console.log("- Products: 5");
    console.log("- Reviews: 3");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
