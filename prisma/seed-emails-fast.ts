import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const emails = [
  "88ragnarok@gmail.com", "a51craigster@sbcglobal.net", "adefashe@hotmail.com", "adelinks2000@yahoo.com",
  "adonayrscuba@gmail.com", "aida.sanches@hotmail.com", "aisack05@yahoo.com", "aisackos@yahoo.com",
  "alan_in_wa@yahoo.com", "albert.mesa@att.net", "alianzarebellc@gmail.com", "allison@alandaughtrylaw.com",
  "amakaumachia@gmail.com", "amakaumadia@gmail.com", "ammarlazo@yahoo.com", "ammie32@sbcglobal.net",
  "amymaxwell9@gmail.com", "annewaldrep@att.net", "arizreynolds@att.com", "arondhuchins@gmail.com",
  "arielfigeroa883@gmail.com", "asantiago1027@yahoo.com", "attorney.dave@yahoo.com", "azgcm@outlook.com",
  "badaopemipo@gmail.com", "barretdl85@gmail.com", "barret@saihouston.com", "batuner2019@gmail.com",
  "bbcamarillo@gmail.com", "beatriztamayo@yahoo.com", "bellshawn70@yahoo.com", "benjaminsaucedo2@gmail.com",
  "berguer5843@sbcglobal.net", "berniemccoyjr@hotmail.com", "billk@highstreetllc.com", "billy@wwtshou.com",
  "bigbendsky@gmail.com", "bmcmillen961@gmail.com", "bmstevens4@gmail.com", "brad.maddux@yahoo.com",
  "bradc@morrellmasonry.com", "brightbholdings@yahoo.com", "brud200@gmail.com", "brian.lardi@hotmail.com",
  "britgetclytn@yahoo.com", "butthyder@gmail.com", "captainstevewebber@gmail.com", "c_stroy26@yahoo.com",
  "catherinemontz@yahoo.com", "cedeag@hotmail.com", "chamdal6@sbcglobal.net", "changstein3@gmail.com",
  "charles.gray@att.net", "charles.grey@att.net", "chitra.shukla@att.net", "chris.pricejk2019@gmail.com",
  "chris6401@att.net", "cicumarin@yahoo.com", "cisneroscustomcarpentry@yahoo.com", "cnblackshear@gmail.com",
  "cobincnielson@gmail.com", "cookiell1355@yahoo.com", "cora.straker@yahoo.com", "corbincneilson@gmail.com",
  "cjpivonka@comcast.net", "cjsingh727@gmail.com", "clhernz59@yahoo.com", "condefa@hotmail.com",
  "cruckconstruction@gmail.com", "crukcontruction@gmail.com", "cprokofieff@gmail.com", "cposell@simplystatedhouston.com",
  "custodiocastro1@gmail.com", "dale.labeau@gmail.com", "dahri@att.net", "dania.lopez@yahoo.com",
  "dania.lopez43@yahoo.com", "danielle_brown86@yahoo.com", "dan@flangeprotection.com", "david@lukahenergy.com",
  "davidckurtz06@gmail.com", "davidholtgrave94@gmail.com", "dbankstxii@aol.com", "d.boehm4106@gmail.com",
  "deesworld@gmail.com", "derick52@hotmail.com", "deswilli711@gmail.com", "dhg5737@gmail.com",
  "dmalinowski@slb.com", "djrice@gmail.com", "donaldrrawls@yahoo.com", "dovesics@gmail.com",
  "drgizersky@gmail.com", "drc@trueimageortho.com", "duartenayiby@gmail.com", "dulcemduarte@icloud.com",
  "duy.luong@yahoo.com", "ed@theheritagemeyerland.com", "edgarvillafane@gmail.com", "eduar.g.bustos@gmail.com",
  "edward.g.bustos@gmail.com", "eduriermarquez@gmail.com", "eifer731@gmail.com", "elfoster4@hotmail.com",
  "ella3118@sbcglobal.net", "elita.musliu@yahoo.com", "elizabethbarberena@live.com", "elizabethbonnie50@gmail.com",
  "ella3118@hotmail.com", "emaniehendo@gmail.com", "emilieramos@att.net", "emmanuel77493@gmail.com",
  "enasonso1988@gmail.com", "enblackshear@gmail.com", "ernestonap@gmail.com", "estraveler@aol.com",
  "esther.dunn@gmail.com", "esthert.dunne@gmail.com", "evadiez64@gmail.com", "evamex3@yahoo.com",
  "fadiakdhelias@gmail.com", "fabpluquet@gmail.com", "fatemac@dhtexas.org", "fatemah@dhtexas.org",
  "fjones@endeavordevel.com", "flaviah@me.com", "frenchys7955@gmail.com", "fsstewart1@gmail.com",
  "g.jonesnov03@gmail.com", "gannon_cj@yahoo.com", "garcia8367@att.net", "gary.burkinshaw@me.com",
  "gefons@fonscor.com", "gbluescreen@gmail.com", "garmaly@att.net", "gdlchapin@outlook.com",
  "gilbert@gbgarza.com", "gillispiekyle@yahoo.com", "gisgurutx@gmail.com", "glchaoin@outlook.com",
  "glgowen@yahoo.com", "glrke65@gmail.com", "gonzalezlupe51@yahoo.com", "gonzalezlupe@yahoo.com",
  "grosu.dan@gmail.com", "gregorybekker.gb@gmail.com", "greg.tran@sbcglobal.net", "gregv133@yahoo.com",
  "gunilla.abbott@gmail.com", "gunther.groning@gmail.com", "gunther.gronins@gmail.com", "guzmancito71@hotmail.com",
  "hadja3@yahoo.com", "hank0007@aol.com", "hparedes97@gmail.com", "helenjack426@gmail.com",
  "helenparker@att.net", "henurse2@hotmail.com", "hnicole0711@yahoo.com", "hughlsp@gmail.com",
  "htruffintejeda@gmail.com", "hudnallk@yahoo.com", "iconteh8@gmail.com", "icontet8@gmail.com",
  "igaby1927@gmail.com", "info@sqsoccer.com", "iriverstonedriving@sbcglobal.net", "jacob.a.sneed@gmail.com",
  "jadlen@live.com", "j23nichola@hotmail.com", "jayhousholder@gmail.com", "jaypee1128@gmail.com",
  "jameslm95@yahoo.com", "jcaraujo@sbcglobal.net", "jckbrr.tt@gmail.com", "jcryquilt@gmail.com",
  "jfeagin69@gmail.com", "jilliancumo@sbcglobal.net", "jhonnyraia2@toxicologyassociates.com", "jhonnatanrubio@hotmail.com",
  "jlgowen@yahoo.com", "jljones1948@att.net", "jmata_1953@yahoo.com", "jmollexen@yahoo.com",
  "jonnette.finly@dtps.state.tx.us", "josec8619@gmail.com", "joec@smartsubseaus.com", "joecambell145@gmail.com",
  "johnferruzzo87@gmail.com", "johnnyraia2_@hotmail.com", "jpkoke@gmail.com", "jpol50@yahoo.com",
  "jpolson@yahoo.com", "jroddy06@gmail.com", "jroddyob@gmail.com", "jrodriguez@sentriforce.com",
  "jrubio06@gmail.com", "jsneedjacob@gmail.com", "jtthomas@constantsecurity.net", "jujurn10@comcast.net",
  "joygregory@sbcglobal.net", "kblestarge@gmail.com", "kaasproperties25@gmail.com", "kayleezittrer@gmail.com",
  "keithcordero@sbcglobal.net", "kevingardener2014@gmail.com", "kevinplyons@icloud.com", "khutalechetan@gmail.com",
  "k-nakol@yahoo.com", "kconstanten@hotmail.com", "katz4now@hotmail.com", "kendra.walker@compass.com",
  "kpoirrier@aol.com", "kumar128@gmail.com", "lagiraldillabakery@gmail.com", "landmark672002@yahoo.com",
  "larrydoral@gmail.com", "latashadorsey72304@yahoo.com", "leland.a.cannon@gmail.com", "lemasupply@hotmail.com",
  "levuh@yahoo.com", "lidialva@yahoo.com", "linlinheahn@yahoo.com", "lisa.a.degraff@gmail.com",
  "lisa@texasreg.com", "lise@texasreg.com", "lnmercado@amcast.net", "lnmercado@comcast.net",
  "lorev767@gmail.com", "lpaneo@hotmail.com", "luv2jam85@gmail.com", "luciobazan@hotmail.com",
  "maggie@charlotte.com.mx", "mangal.mirwais14060@gmail.com", "marcojec@hotmail.com", "marcusdspencer@hotmail.com",
  "mark77379@yahoo.com", "markccddsmbao@yahoo.com", "markus@earl-and-markus.com", "martha.hinojosa@att.net",
  "maryews1115@gmail.com", "matt_kessinger@yahoo.com", "mayhews1115@gmail.com", "mccmarlison@aol.com",
  "mcmarlison@aol.com", "mdolan.tx@gmail.com", "meganholtgrave@gmail.com", "meilyn.corona@yahoo.com",
  "melissamcclain14@aol.com", "melissawong365@gmail.com", "mflores4life@aol.com", "michaelbednar@gmail.com",
  "michaeldavidblanco@gmail.com", "mikey.57255@gmail.com", "milmeg@aol.com", "miss_nu2@yahoo.com",
  "mjorgeortega@gmail.com", "mjsvr@att.net", "mmancia@aol.com", "morrisondm@gmail.com",
  "mourningcar@gmail.com", "mpozos87@gmail.com", "mrstv@att.net", "mrmichaelbednar@gmail.com",
  "ms.khong@outlook.com", "mybulkaccount@yahoo.com", "nahly730@gmail.com", "narilynriley@yahoo.com",
  "nathomas580@gmail.com", "nathomas80@yahoo.com", "nb281171@yahoo.com", "ndnguyen@outlook.com",
  "nellycs28@yahoo.com", "nermeena.kamal@gmail.com", "netocouso@yahoo.com", "nhoffman1970@gmail.com",
  "nieser@sbcglobal.net", "nuella246@gmail.com", "obj.g@att.net", "olatubosun.funmi@yahoo.com",
  "olga.bonjour@yahoo.com", "orlandac36@gmail.com", "orthojunkie@gmail.com", "patriciambermudez@gmail.com",
  "pbrown5353@yahoo.com", "pablorubio2123@gmail.com", "paulgerke53@gmail.com", "pedromanuelantuna@gmail.com",
  "planit3x@gmail.com", "prettypawspetspallc@gmail.com", "property.hun@ahmadiyya.us", "queenbea27@sbcglobal.net",
  "radducci@bldrschoice.com", "ramonfgarcia@yahoo.com", "raidele90@gmail.com", "raulmchdo@yahoo.com",
  "raydele90@gmail.com", "raymondweems1@gmail.com", "rayologistics@gmail.com", "rb08182013@gmail.com",
  "rbenson09.rd@gmail.com", "rdcarmi@gmail.com", "rdruce@ieee.org", "reginaperkins@gmail.com",
  "reginaperkins@sbcglobal.net", "renaissancerenovationllc@gmail.com", "reynoldsconnor47@gmail.com", "ridgejoh30ml@gmail.com",
  "rigos1411@gmail.com", "rlacazia@yahoo.com", "roberca31@gmail.com", "robertahum1992@gmail.com",
  "roberto.dalton@sls.com", "robinlhale@peoplepc.com", "rosalie.schwarz5@gmail.com", "rskutca@sbcglobal.net",
  "rsqlchal@jrbengineering.com", "rsolchal@jrbengineering.com", "ryanroeske@yahoo.com", "s.inclan88@yahoo.com",
  "s.inclan88c@yahoo.com", "safresa2013@hotmail.com", "sales@citywidepatios.com", "sam.banda@integrallift.com",
  "sandragarcia0103@gmail.com", "sandrammvalencia@gmail.com", "sanhouty@gmail.com", "sarahaggreh@yahoo.com",
  "sealadetio@gmail.com", "shailapochi@gmail.com", "shansbay@att.net", "sharondwhetstone@gmail.com",
  "shawn.fro@icloud.com", "shih_kang@yahoo.com", "shishabraids@yahoo.com", "silverbackcollision@live.com",
  "smrk2022@outlook.com", "sovonthou@yahoo.com", "staciyclark@gmail.com", "starr219@gmail.com",
  "stevenflowers@yahoo.com", "stereomann74@gmail.com", "steflebrun@doffing.net", "sunny.timbalia@gmail.com",
  "sv442L@yahoo.com", "t.abi13@yahoo.com", "tahashujauddin@yahoo.com", "tarig.osman007@gmail.com",
  "tdgood111@yahoo.com", "teamheitman@hotmail.com", "terancegartica@yahoo.com", "texaskickboxing@gmail.com",
  "timothy.villanueva@att.net", "topefolarin@gmail.com", "tolmultiservice@gmail.com", "tom.brewer@danerealtytexas.com",
  "tosinodetola@hotmail.com", "travisself07@yahoo.com", "tristatetaxidermy@comcast.net", "twryc@comcast.net",
  "underbrinkjan@gmail.com", "vassolo@gmail.com", "vegajoanna07@gmail.com", "velazquez77091@hotmail.com",
  "velmashockley@prodigy.net", "vesseygiles@gmail.com", "villedayoni78@gmail.com", "vpgarza0501@gmail.com",
  "vsenp8@gmail.com", "waldrep.tom@att.net", "weeds1957sparkle@yahoo.com", "whbronw@hotmail.com",
  "ykchod@gmail.com", "yoaluz@yahoo.com", "yolanager@icloud.com", "yglesias1996@icloud.com",
  "yglesias2004@yahoo.com", "yudithpedraza@gmail.com", "zarrarahmad@gmail.com", "zachary@leveledconcrete.com"
];

async function main() {
  console.log("🌱 Starting fast seed...");

  // Remove duplicates and convert to lowercase
  const uniqueEmails = [...new Set(emails.map(e => e.toLowerCase()))];
  console.log(`📧 Total unique emails: ${uniqueEmails.length}`);

  // Get existing emails to avoid duplicates
  const existingEmails = await prisma.contactEmail.findMany({
    where: {
      email: { in: uniqueEmails }
    },
    select: { email: true }
  });

  const existingEmailSet = new Set(existingEmails.map(e => e.email));
  const newEmails = uniqueEmails.filter(email => !existingEmailSet.has(email));

  console.log(`✅ New emails to add: ${newEmails.length}`);
  console.log(`⏭️  Already exist: ${existingEmailSet.size}`);

  if (newEmails.length === 0) {
    console.log("✨ No new emails to add!");
    return;
  }

  // Process in batches to avoid timeout
  let created = 0;
  const batchSize = 20;

  for (let i = 0; i < newEmails.length; i += batchSize) {
    const batch = newEmails.slice(i, i + batchSize);

    for (const email of batch) {
      try {
        const name = email.split("@")[0].replace(/[._-]/g, " ");
        const capitalizedName = name
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

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
      } catch (error) {
        console.error(`❌ Error with ${email}:`, error);
      }
    }

    console.log(`📊 Progress: ${Math.min(i + batchSize, newEmails.length)}/${newEmails.length}`);
  }

  console.log(`\n✅ Successfully created ${created} contacts with emails!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
