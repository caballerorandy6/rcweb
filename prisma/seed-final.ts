import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const emails = [
  "t.abi13@yahoo.com", "texaskickboxing@gmail.com", "changstein3@gmail.com", "ella3118@sbcglobal.net",
  "mando.g369@gmail.com", "maggie@charlotte.com.mx", "arondhuchins@gmail.com", "daubers.pups85@icloud.com",
  "joe11023@cloud.com", "beatriztamayo@yahoo.com", "brud200@gmail.com", "benjaminsaucedo2@gmail.com",
  "adelinks2000@yahoo.com", "batuner2019@gmail.com", "k-nakol@yahoo.com", "tolmultiservice@gmail.com",
  "cedeag@hotmail.com", "88ragnarok@gmail.com", "charles.grey@att.net", "cjpivonka@comcast.net",
  "chris.pricejk2019@gmail.com", "gannon_cj@yahoo.com", "alianzarebellc@gmail.com", "enblackshear@gmail.com",
  "crukcontruction@gmail.com", "velazquez77091@hotmail.com", "d.boehm4106@gmail.com", "orthojunkie@gmail.com",
  "attorney.dave@yahoo.com", "shih_kang@yahoo.com", "fatemah@dhtexas.org", "garcia8367@att.net",
  "dmalinowski@slb.com", "morrisondm@gmail.com", "duy.luong@yahoo.com", "berguer5843@sbcglobal.net",
  "eifer731@gmail.com", "eduard.g.bustos@gmail.com", "eduriermarquez@gmail.com", "emaniehendo@gmail.com",
  "emmanuel77493@gmail.com", "elejew8@gmail.com", "estraveler@aol.com", "epanesso74@gmail.com",
  "elfoster4@hotmail.com", "esthert.dunne@gmail.com", "evadiez64@gmail.com", "flaviah@me.com",
  "frenchys7955@gmail.com", "igaby1927@gmail.com", "glchaoin@outlook.com", "g.jonesnov03@gmail.com",
  "glrke65@gmail.com", "greg.tran@sbcglobal.net", "gregorybekker.gb@gmail.com", "gunther.gronins@gmail.com",
  "evamex3@yahoo.com", "hadja3@yahoo.com", "mayhews1115@gmail.com", "adefashe@hotmail.com",
  "meilyn.corona@yahoo.com", "helenjack426@gmail.com", "helenparker@cct.net", "hank0007@aol.com",
  "derick52@hotmail.com", "icontet8@gmail.com", "nieser@sbcglobal.net", "jckbrr.tt@gmail.com",
  "jroddyob@gmail.com", "nathomas580@gmail.com", "jayhousholder@gmail.com", "yoaluz@yahoo.com",
  "jlgowen@yahoo.com", "markus@earl-and-markus.com", "jpolson@yahoo.com", "kconstanten@hotmail.com",
  "kayleezittrer@gmail.com", "yglesias2004@yahoo.com", "guzmancito71@hotmail.com", "leland.a.cannon@gmail.com",
  "riverstomdriving@sbc.global.net", "lpaneso@hotmail.com", "linlinheahn@yahoo.com", "lise@texasreg.com",
  "sv442L@yahoo.com", "ld_texas@yahoo.com", "lnmercado@amcast.net", "enasonso1988@gmail.com",
  "ldmhtx@gmail.com", "tahashujauddin@yahoo.com", "safresa2103@hotmail.com", "gonzalezlupe51@yahoo.com",
  "mjorgeortega@gmail.com", "markccddsmbao@yahoo.com", "mark77379@yahoo.com", "mpeek76@gmail.com",
  "mrmichaelbednar@gmail.com", "mikey.57255@gmail.com", "mmancia@aol.com", "mdolan.tx@gmail.com",
  "amakaumachia@gmail.com", "netocouso@yahoo.com", "badaopemipo@gmail.com", "vsenp8@gmail.com",
  "patriciambermudez@gmail.com", "aisackos@yahoo.com", "bellowphillman@gmail.com", "nb281171@yahoo.com",
  "ramonfgarcia@yahoo.com", "rlacazia@yahoo.com", "raulmchdo@yahoo.com", "rbenson09.rd@gmail.com",
  "raydele90@gmail.com", "smrk2022@outlook.com", "rayologistics@gmail.com", "reginaperkins@gmail.com",
  "rjstaffeld@yahoo.com", "rdruce@ieee.org", "rcj2012@icloud.com", "robertahum1992@gmail.com",
  "dale.labeau@gmail.com", "s.inclan88c@yahoo.com", "sandrammvalencia@gmail.com", "sharondwhetstone@gmail.com",
  "bellshawn70@yahoo.com", "miss_nu2@yahoo.com", "sovonthou@yahoo.com", "staciyclark@gmail.com",
  "sunny.timbalia@gmail.com", "tarig.osman007@gmail.com", "jerome.rhodes55@yahoo.com", "ttran1188@gmail.com",
  "mrstv@att.net", "timothy.villanueva@att.net", "topefolarin@gmail.com", "velmashockley@prodigy.net",
  "yolanager@icloud.com", "villedayoni78@gmail.com", "allen.orum@gmail.com", "cicumarin@yahoo.com",
  "corbincneilson@gmail.com", "danielle_brown86@yahoo.com", "dhg5737@gmail.com", "fabpluquet@gmail.com",
  "hughlsp@gmail.com", "joec@smartsubseaus.com", "jthomas@constantsecurity.net", "keithcordero@sbcglobal.net",
  "lashandamaule@hotmail.com", "matt_kessinger@yahoo.com", "melissawong365@gmail.com", "nhoffman1970@gmail.com",
  "olatubosun.funmi@yahoo.com", "roberca31@gmail.com", "rskutca@sbcglobal.net", "sschiba786@gmail.com",
  "starr219@gmail.com", "shailapochi@gmail.com", "dania.lopez@yahoo.com", "ridgejoh30ml@gmail.com",
  "milmeg@aol.com", "ndnguyen@outlook.com", "stevenflowers@yahoo.com", "djrice@gmail.com",
  "jadlen@live.com", "alan_in_wa@yahoo.com", "mflores4life@aol.com", "sanhouty@gmail.com",
  "mangal.mirwais14060@gmail.com", "ryanroeske@yahoo.com", "pbrown5353@yahoo.com"
];

async function main() {
  console.log("🌱 Starting seed...");

  // Remove duplicates and convert to lowercase
  const uniqueEmails = [...new Set(emails.map(e => e.toLowerCase()))];
  console.log(`📧 Processing ${uniqueEmails.length} unique emails`);

  let created = 0;
  let skipped = 0;

  // Process in batches of 10 to avoid timeout
  const batchSize = 10;
  for (let i = 0; i < uniqueEmails.length; i += batchSize) {
    const batch = uniqueEmails.slice(i, i + batchSize);

    for (const email of batch) {
      try {
        // Check if exists
        const exists = await prisma.contactEmail.findUnique({
          where: { email }
        });

        if (exists) {
          skipped++;
          continue;
        }

        // Extract name
        const name = email.split("@")[0].replace(/[._-]/g, " ");
        const capitalizedName = name
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        // Create contact with email
        await prisma.contact.create({
          data: {
            name: capitalizedName,
            marketingConsent: true,
            emails: {
              create: { email }
            }
          }
        });

        created++;
        console.log(`✅ ${created}. Created: ${email}`);
      } catch (error) {
        console.error(`❌ Error with ${email}:`, error);
      }
    }

    // Progress update every batch
    console.log(`📊 Progress: ${i + batch.length}/${uniqueEmails.length}`);
  }

  console.log(`\n✨ Done!`);
  console.log(`✅ Created: ${created}`);
  console.log(`⏭️  Skipped (already exist): ${skipped}`);
}

main()
  .catch((e) => {
    console.error("❌ Failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
