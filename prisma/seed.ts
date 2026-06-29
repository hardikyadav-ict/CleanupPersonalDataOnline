import { PrismaClient, BrokerType, RemovalMethod } from "@prisma/client";

const prisma = new PrismaClient();

const BROKERS = [
  { slug: "spokeo", name: "Spokeo", website: "https://www.spokeo.com", type: "PUBLIC" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.spokeo.com/optout", averageDays: 14, captchaType: "recaptcha_v2", recurrenceDays: 90 },
  { slug: "whitepages", name: "Whitepages", website: "https://www.whitepages.com", type: "PUBLIC" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.whitepages.com/suppression_requests", averageDays: 7 },
  { slug: "beenverified", name: "BeenVerified", website: "https://www.beenverified.com", type: "PUBLIC" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.beenverified.com/optout", averageDays: 10, captchaType: "recaptcha_v2" },
  { slug: "truthfinder", name: "TruthFinder", website: "https://www.truthfinder.com", type: "PUBLIC" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.truthfinder.com/optout", averageDays: 10, captchaType: "recaptcha_v2" },
  { slug: "peoplefinders", name: "PeopleFinders", website: "https://www.peoplefinders.com", type: "PUBLIC" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.peoplefinders.com/optout", averageDays: 14 },
  { slug: "intelius", name: "Intelius", website: "https://www.intelius.com", type: "PUBLIC" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.intelius.com/optout", averageDays: 14 },
  { slug: "peekyou", name: "PeekYou", website: "https://www.peekyou.com", type: "PUBLIC" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.peekyou.com/about/contact", averageDays: 7 },
  { slug: "mylife", name: "MyLife", website: "https://www.mylife.com", type: "PUBLIC" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.mylife.com/optout", averageDays: 21, captchaType: "hcaptcha" },
  { slug: "acxiom", name: "Acxiom", website: "https://www.acxiom.com", type: "PRIVATE" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.acxiom.com/about-us/privacy/", averageDays: 30, recurrenceDays: 180 },
  { slug: "oracle", name: "Oracle Data Cloud", website: "https://www.oracle.com", type: "PRIVATE" as BrokerType, jurisdiction: "GLOBAL", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.oracle.com/legal/privacy/marketing-cloud-data-cloud-privacy-policy.html", averageDays: 30, recurrenceDays: 180 },
  { slug: "epsilon", name: "Epsilon", website: "https://www.epsilon.com", type: "PRIVATE" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.epsilon.com/privacy-policy", averageDays: 45, recurrenceDays: 180 },
  { slug: "experian", name: "Experian", website: "https://www.experian.com", type: "PRIVATE" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.experian.com/consumer/optout.html", averageDays: 14 },
  { slug: "transunion", name: "TransUnion", website: "https://www.transunion.com", type: "PRIVATE" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.transunion.com/opt-out", averageDays: 14 },
  { slug: "equifax", name: "Equifax", website: "https://www.equifax.com", type: "PRIVATE" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.equifax.com/personal/education/identity-protection/articles/-/learn/opt-out", averageDays: 14 },
  { slug: "radaris", name: "Radaris", website: "https://www.radaris.com", type: "PUBLIC" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.radaris.com/page/optout", averageDays: 7 },
  { slug: "ussearch", name: "USSearch", website: "https://www.ussearch.com", type: "PUBLIC" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.ussearch.com/optout", averageDays: 14 },
  { slug: "peoplesmart", name: "PeopleSmart", website: "https://www.peoplesmart.com", type: "PUBLIC" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.peoplesmart.com/optout", averageDays: 14 },
  { slug: "checkmate", name: "Checkmate", website: "https://www.checkmate.com", type: "PUBLIC" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.checkmate.com/optout", averageDays: 10 },
  { slug: "clustrmaps", name: "ClustrMaps", website: "https://clustrmaps.com", type: "PUBLIC" as BrokerType, jurisdiction: "GLOBAL", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://clustrmaps.com/pages/optout", averageDays: 7 },
  { slug: "neighborreport", name: "NeighborReport", website: "https://neighborreport.com", type: "PUBLIC" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://neighborreport.com/optout", averageDays: 7 },
  { slug: "yellowpages", name: "YellowPages", website: "https://www.yellowpages.com", type: "PUBLIC" as BrokerType, jurisdiction: "US", removalMethod: "EMAIL" as RemovalMethod, optOutUrl: "https://www.yellowpages.com/contact", averageDays: 14 },
  { slug: "cyberbackgroundchecks", name: "CyberBackgroundChecks", website: "https://www.cyberbackgroundchecks.com", type: "PUBLIC" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.cyberbackgroundchecks.com/optout", averageDays: 7 },
  { slug: "publicrecords", name: "PublicRecords", website: "https://publicrecords.com", type: "PUBLIC" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://publicrecords.com/optout", averageDays: 10 },
  { slug: "locatepeople", name: "LocatePeople", website: "https://www.locatepeople.org", type: "PUBLIC" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.locatepeople.org/optout", averageDays: 7 },
  { slug: "addresses", name: "Addresses.com", website: "https://www.addresses.com", type: "PUBLIC" as BrokerType, jurisdiction: "US", removalMethod: "FORM" as RemovalMethod, optOutUrl: "https://www.addresses.com/optout", averageDays: 7 },
];

async function main() {
  console.log("Seeding database...");

  for (const broker of BROKERS) {
    await prisma.dataBroker.upsert({
      where: { slug: broker.slug },
      update: broker,
      create: broker,
    });
  }

  // Create a test coupon
  await prisma.coupon.upsert({
    where: { code: "LAUNCH25" },
    update: { discountPct: 25, isActive: true, maxUses: 1000 },
    create: {
      code: "LAUNCH25",
      discountPct: 25,
      isActive: true,
      maxUses: 1000,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "PRIVACY50" },
    update: { discountPct: 50, isActive: true, maxUses: 500, expiresAt: new Date("2026-12-31") },
    create: {
      code: "PRIVACY50",
      discountPct: 50,
      isActive: true,
      maxUses: 500,
      expiresAt: new Date("2026-12-31"),
    },
  });

  console.log(`Seeded ${BROKERS.length} data brokers`);
  console.log("Seeded 2 coupon codes");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
