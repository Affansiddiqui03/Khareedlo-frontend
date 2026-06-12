// src/data/outlets.js
// Verified outlet locations — all 4 brands — from official Google Maps data
// Last updated: June 2026
// Total: 138 outlets across 6 cities
// Matches DB exactly: J.=41, Alkaram=32, Limelight=45, Zellbury=20

const outlets = [

  // ══════════════════════════════════════════════════════════
  //  J. BY JUNAID JAMSHED  (brandId: b-j)  — 41 outlets
  // ══════════════════════════════════════════════════════════

  // KARACHI (17)
  { id:"j-01", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Dolmen Mall Clifton",         coords:{lat:24.8022,lng:67.0299}, address:"Dolmen Mall, Block 4 Clifton, Karachi",                        city:"Karachi",    hours:"10 AM – 10 PM",   phone:"021-111-786-786" },
  { id:"j-02", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Ocean Mall Clifton",          coords:{lat:24.8239,lng:67.0356}, address:"Ocean Mall, Block 9 Clifton, Karachi",                         city:"Karachi",    hours:"10 AM – 10 PM",   phone:"021-111-786-786" },
  { id:"j-03", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Zamzama DHA",                 coords:{lat:24.8130,lng:67.0620}, address:"Zamzama Boulevard, DHA Phase 5, Karachi",                      city:"Karachi",    hours:"10 AM – 10 PM",   phone:"021-111-786-786" },
  { id:"j-04", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Lucky One Mall",              coords:{lat:24.9322,lng:67.0872}, address:"1st Floor, Lucky One Mall, Rashid Minhas Road, Karachi",        city:"Karachi",    hours:"10 AM – 10 PM",   phone:"021-111-786-786" },
  { id:"j-05", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Dolmen Mall North Nazimabad", coords:{lat:24.9320,lng:67.0530}, address:"Dolmen Mall, Block C North Nazimabad, Karachi",                 city:"Karachi",    hours:"10 AM – 10 PM",   phone:"021-111-786-786" },
  { id:"j-06", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Factory Outlet PECHS",        coords:{lat:24.8740,lng:67.0500}, address:"Block 2 PECHS, Karachi",                                       city:"Karachi",    hours:"10 AM – 9 PM",    phone:"021-111-786-786" },
  { id:"j-07", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Factory Outlet Gulshan",      coords:{lat:24.9259,lng:67.0939}, address:"Rashid Minhas Road, Opposite Aladdin Park, Gulshan, Karachi",   city:"Karachi",    hours:"10 AM – 9 PM",    phone:"021-111-786-786" },
  { id:"j-08", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Stargate / Makro",            coords:{lat:24.8920,lng:67.0760}, address:"Shahrah-e-Faisal, Near Makro, Karachi",                        city:"Karachi",    hours:"10 AM – 9 PM",    phone:"021-111-786-786" },
  { id:"j-09", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Malir Cantt",                 coords:{lat:24.8920,lng:67.1950}, address:"Station Shopping Complex, Malir Cantt, Karachi",                city:"Karachi",    hours:"10 AM – 9:30 PM", phone:"021-111-786-786" },
  { id:"j-10", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – BMCHS Road Branch",           coords:{lat:24.8740,lng:67.0640}, address:"31 BMCHS Road No. 2, Karachi",                                  city:"Karachi",    hours:"10 AM – 9:30 PM", phone:"021-111-786-786" },
  { id:"j-11", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – KDA Market",                  coords:{lat:24.9240,lng:67.0890}, address:"Plot B-110, KDA Market, Karachi",                               city:"Karachi",    hours:"10 AM – 9 PM",    phone:"021-111-786-786" },
  { id:"j-12", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Tariq Road",                  coords:{lat:24.8661,lng:67.0613}, address:"Kurta Gali, Tariq Road, Karachi",                               city:"Karachi",    hours:"10 AM – 9:30 PM", phone:"021-111-786-786" },
  { id:"j-13", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Dolmen Mall Tariq Road",      coords:{lat:24.8680,lng:67.0600}, address:"Dolmen Mall, Main Tariq Road, Karachi",                         city:"Karachi",    hours:"10 AM – 10 PM",   phone:"021-111-786-786" },
  { id:"j-14", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Saima Jinnah Icon Mall",      coords:{lat:24.9048,lng:67.1684}, address:"Saima Jinnah Icon Mall, Jinnah Avenue Road, Malir Cantt, Karachi",                  city:"Karachi",    hours:"10 AM – 10 PM",   phone:"021-111-786-786" },
  { id:"j-15", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Atrium Mall Saddar",          coords:{lat:24.8560,lng:67.0154}, address:"Atrium Mall, Saddar, Karachi",                                  city:"Karachi",    hours:"10 AM – 9 PM",    phone:"021-111-786-786" },
  { id:"j-16", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Hyderi / Dolmen Hyderi",      coords:{lat:24.9133,lng:67.0680}, address:"Dolmen Mall Hyderi, North Nazimabad, Karachi",                  city:"Karachi",    hours:"10 AM – 9:30 PM", phone:"021-111-786-786" },
  { id:"j-17", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – North Nazimabad Main",        coords:{lat:24.9210,lng:67.0660}, address:"Block H North Nazimabad, Karachi",                              city:"Karachi",    hours:"10 AM – 9:30 PM", phone:"021-111-786-786" },

  // LAHORE (11)
  { id:"j-18", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – MM Alam Road",                coords:{lat:31.5102,lng:74.3416}, address:"Plot 89 MM Alam Road, Gulberg III, Lahore",                     city:"Lahore",     hours:"10 AM – 10 PM",   phone:"042-111-786-786" },
  { id:"j-19", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Iqbal Town",                  coords:{lat:31.4930,lng:74.3240}, address:"Main Boulevard Allama Iqbal Town, Lahore",                      city:"Lahore",     hours:"10 AM – 9:30 PM", phone:"042-111-786-786" },
  { id:"j-20", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – DHA Y-Block",                 coords:{lat:31.4769,lng:74.3756}, address:"Plot 189, Y-Block, DHA Phase 3, Lahore",                        city:"Lahore",     hours:"10 AM – 10 PM",   phone:"042-111-786-786" },
  { id:"j-21", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Johar Town G1",               coords:{lat:31.4627,lng:74.2741}, address:"Plot 1-A, Block G, Johar Town, Lahore",                         city:"Lahore",     hours:"10 AM – 10 PM",   phone:"042-111-786-786" },
  { id:"j-22", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Emporium Mall",               coords:{lat:31.4678,lng:74.2664}, address:"Abdul Haque Road, Johar Town, Lahore",                          city:"Lahore",     hours:"10 AM – 11 PM",   phone:"042-111-786-786" },
  { id:"j-23", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Dolmen Mall Lahore",          coords:{lat:31.4650,lng:74.3810}, address:"Dolmen Mall, DHA Phase 6, Lahore",                              city:"Lahore",     hours:"10 AM – 10 PM",   phone:"042-111-786-786" },
  { id:"j-24", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Model Town Link Road",        coords:{lat:31.4830,lng:74.3070}, address:"Al-Hafiz Trade Centre, Model Town Link Road, Lahore",            city:"Lahore",     hours:"10 AM – 9 PM",    phone:"042-111-786-786" },
  { id:"j-25", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Fortress Stadium",            coords:{lat:31.5420,lng:74.3350}, address:"Fortress Stadium, Lahore",                                      city:"Lahore",     hours:"10 AM – 9:30 PM", phone:"042-111-786-786" },
  { id:"j-26", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Mall of Lahore",              coords:{lat:31.5292,lng:74.3783}, address:"172 Tufail Road, Cantt, Lahore",                                city:"Lahore",     hours:"10 AM – 10 PM",   phone:"042-111-786-786" },
  { id:"j-27", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Packages Mall",               coords:{lat:31.4714,lng:74.3561}, address:"Packages Mall, Walton Road, Lahore",                            city:"Lahore",     hours:"10 AM – 10 PM",   phone:"042-111-786-786" },
  { id:"j-28", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Gulberg Branch",              coords:{lat:31.5150,lng:74.3450}, address:"Gulberg III, Lahore",                                           city:"Lahore",     hours:"10 AM – 9:30 PM", phone:"042-111-786-786" },

  // ISLAMABAD (6)
  { id:"j-29", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – F-6 Markaz",                  coords:{lat:33.7290,lng:73.0630}, address:"F-6 Markaz, Islamabad",                                         city:"Islamabad",  hours:"10 AM – 9 PM",    phone:"051-111-786-786" },
  { id:"j-30", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – F-7 Markaz",                  coords:{lat:33.7200,lng:73.0520}, address:"College Road, F-7 Markaz, Islamabad",                           city:"Islamabad",  hours:"10 AM – 9 PM",    phone:"051-111-786-786" },
  { id:"j-31", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – F-10 Markaz",                 coords:{lat:33.6980,lng:73.0130}, address:"Shalimar Plaza, F-10 Markaz, Islamabad",                        city:"Islamabad",  hours:"10 AM – 9 PM",    phone:"051-111-786-786" },
  { id:"j-32", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Centaurus Mall",              coords:{lat:33.7077,lng:73.0499}, address:"Centaurus Mall, Jinnah Avenue F-8, Islamabad",                  city:"Islamabad",  hours:"10 AM – 10 PM",   phone:"051-111-786-786" },
  { id:"j-33", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Giga Mall DHA",               coords:{lat:33.5209,lng:73.1577}, address:"Giga Mall, DHA Phase II, GT Road, Islamabad",                   city:"Islamabad",  hours:"10 AM – 10 PM",   phone:"051-111-786-786" },
  { id:"j-34", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Giga Mall Opposite DHA 2",    coords:{lat:33.5215,lng:73.1580}, address:"Main GT Road, Opposite Giga Mall DHA Phase 2, Islamabad",        city:"Islamabad",  hours:"10 AM – 10 PM",   phone:"051-111-786-786" },

  // RAWALPINDI (3)
  { id:"j-35", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Saddar Rawalpindi",           coords:{lat:33.5989,lng:73.0553}, address:"Zarkon Plaza, Bank Road Saddar, Rawalpindi",                    city:"Rawalpindi", hours:"10 AM – 9 PM",    phone:"051-111-786-786" },
  { id:"j-36", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Satellite Town",              coords:{lat:33.6180,lng:73.0810}, address:"Silk Center, Murree Road, Rehmanabad, Rawalpindi",              city:"Rawalpindi", hours:"10 AM – 9 PM",    phone:"051-111-786-786" },
  { id:"j-37", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – PWD Branch",                  coords:{lat:33.5720,lng:73.0980}, address:"PWD Housing Society, Sector A, Rawalpindi",                     city:"Rawalpindi", hours:"10 AM – 9 PM",    phone:"051-111-786-786" },

  // FAISALABAD (3)
  { id:"j-38", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – ChenOne Road",                coords:{lat:31.4187,lng:73.0790}, address:"Shop 22/A ChenOne Road, Faisalabad",                            city:"Faisalabad", hours:"10 AM – 9 PM",    phone:"041-111-786-786" },
  { id:"j-39", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Peoples Colony",              coords:{lat:31.4250,lng:73.0900}, address:"Bahria Foundation Area, Peoples Colony, Faisalabad",            city:"Faisalabad", hours:"10 AM – 9 PM",    phone:"041-111-786-786" },
  { id:"j-40", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Galleria Mall",               coords:{lat:31.4320,lng:73.0830}, address:"Galleria Mall, Faisalabad",                                     city:"Faisalabad", hours:"10 AM – 9:30 PM", phone:"041-111-786-786" },

  // MULTAN (1)
  { id:"j-41", brandId:"b-j", brandName:"J. by Junaid Jamshed", outletName:"J. – Abdali Road Multan",          coords:{lat:30.1575,lng:71.5249}, address:"High Court Staff Colony, Abdali Road, Multan",                  city:"Multan",     hours:"10 AM – 9 PM",    phone:"061-111-786-786" },

  // ══════════════════════════════════════════════════════════
  //  ALKARAM STUDIO  (brandId: b-alkaram)  — 32 outlets
  // ══════════════════════════════════════════════════════════

  // KARACHI (11)
  { id:"a-01", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – BMCHS Sharafabad",        coords:{lat:24.8760,lng:67.0620}, address:"Khanani Center, Bahadur Shah Zafar Road, BMCHS, Karachi",       city:"Karachi",   hours:"10 AM – 9:30 PM", phone:"021-111-225-272" },
  { id:"a-02", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Factory Outlet Gulshan",  coords:{lat:24.9259,lng:67.0939}, address:"Rashid Minhas Road, Gulshan, Karachi",                          city:"Karachi",   hours:"10 AM – 9 PM",    phone:"021-111-225-272" },
  { id:"a-03", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Jauhar Chowrangi",        coords:{lat:24.9180,lng:67.1050}, address:"B-181 Johar Chowrangi Road, Karachi",                           city:"Karachi",   hours:"10 AM – 9 PM",    phone:"021-111-225-272" },
  { id:"a-04", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Atrium Mall Saddar",      coords:{lat:24.8560,lng:67.0154}, address:"Raja Ghazanfar Ali Road, Atrium Mall, Saddar, Karachi",          city:"Karachi",   hours:"10 AM – 9 PM",    phone:"021-111-225-272" },
  { id:"a-05", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Lucky One Mall",          coords:{lat:24.9322,lng:67.0872}, address:"Block 21 Gulberg, Lucky One Mall, Karachi",                     city:"Karachi",   hours:"10 AM – 10 PM",   phone:"021-111-225-272" },
  { id:"a-06", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Korangi Branch",          coords:{lat:24.8420,lng:67.1330}, address:"Korangi Area, Karachi",                                         city:"Karachi",   hours:"10 AM – 9 PM",    phone:"021-111-225-272" },
  { id:"a-07", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Landhi Branch",           coords:{lat:24.8460,lng:67.1830}, address:"Main Landhi Road, Karachi",                                     city:"Karachi",   hours:"10 AM – 9 PM",    phone:"021-111-225-272" },
  { id:"a-08", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Dolmen Mall Clifton",     coords:{lat:24.8022,lng:67.0299}, address:"2nd Floor, Block 4 Clifton, Dolmen Mall, Karachi",               city:"Karachi",   hours:"10 AM – 10 PM",   phone:"021-111-225-272" },
  { id:"a-09", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – KDA Market Gulshan",      coords:{lat:24.9240,lng:67.0890}, address:"KDA Market, Gulshan-e-Iqbal Block 3, Karachi",                   city:"Karachi",   hours:"10 AM – 9 PM",    phone:"021-111-225-272" },
  { id:"a-10", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Saima Pari Point",        coords:{lat:24.9280,lng:67.0700}, address:"Saima Pari Point, North Nazimabad, Karachi",                    city:"Karachi",   hours:"10 AM – 9:30 PM", phone:"021-111-225-272" },
  { id:"a-11", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Head Office Mai Kolachi", coords:{lat:24.8330,lng:67.0050}, address:"Mai Kolachi Bypass, Opposite US Embassy, Karachi",              city:"Karachi",   hours:"10 AM – 6 PM",    phone:"021-111-225-272" },

  // LAHORE (8)
  { id:"a-12", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Emporium Mall",           coords:{lat:31.4678,lng:74.2664}, address:"Abdul Haque Road, Johar Town, Emporium Mall, Lahore",           city:"Lahore",    hours:"10 AM – 10 PM",   phone:"042-111-225-272" },
  { id:"a-13", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – DHA Y-Block",             coords:{lat:31.4780,lng:74.3760}, address:"Building No. 206, DHA Phase 3, Lahore",                         city:"Lahore",    hours:"10 AM – 10 PM",   phone:"042-111-225-272" },
  { id:"a-14", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Shahrah Nazaria-e-Pakistan",coords:{lat:31.5390,lng:74.3290},address:"189 Shahrah Nazaria-e-Pakistan, Lahore",                       city:"Lahore",    hours:"10 AM – 9:30 PM", phone:"042-111-225-272" },
  { id:"a-15", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Iqbal Town",              coords:{lat:31.4930,lng:74.3240}, address:"7 Pak Block, Allama Iqbal Town, Lahore",                        city:"Lahore",    hours:"10 AM – 9:30 PM", phone:"042-111-225-272" },
  { id:"a-16", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Shalimar Link Road",      coords:{lat:31.5510,lng:74.3790}, address:"Shalamar Town, Lahore",                                         city:"Lahore",    hours:"10 AM – 9:30 PM", phone:"042-111-225-272" },
  { id:"a-17", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Model Town Link Road",    coords:{lat:31.4830,lng:74.3070}, address:"30-A Model Town Link Road, Lahore",                             city:"Lahore",    hours:"10 AM – 9:30 PM", phone:"042-111-225-272" },
  { id:"a-18", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Packages Mall",           coords:{lat:31.4714,lng:74.3561}, address:"1st Floor, Packages Mall, Walton Road, Lahore",                 city:"Lahore",    hours:"10 AM – 10 PM",   phone:"042-111-225-272" },
  { id:"a-19", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – MM Alam Gulberg",         coords:{lat:31.5105,lng:74.3419}, address:"MM Alam Road, Gulberg, Lahore",                                 city:"Lahore",    hours:"10 AM – 9:30 PM", phone:"042-111-225-272" },

  // ISLAMABAD (4)
  { id:"a-20", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – F-10 Markaz",             coords:{lat:33.6980,lng:73.0130}, address:"F-10 Markaz, Islamabad",                                        city:"Islamabad", hours:"10 AM – 9 PM",    phone:"051-111-225-272" },
  { id:"a-21", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Centaurus Mall",          coords:{lat:33.7077,lng:73.0499}, address:"1st Floor, Jinnah Avenue F-8, Centaurus Mall, Islamabad",        city:"Islamabad", hours:"10 AM – 10 PM",   phone:"051-111-225-272" },
  { id:"a-22", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – PWD Society",             coords:{lat:33.5720,lng:73.0980}, address:"Street No. 5, PWD Area, Islamabad",                             city:"Islamabad", hours:"10 AM – 9 PM",    phone:"051-111-225-272" },
  { id:"a-23", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Giga Mall",               coords:{lat:33.5209,lng:73.1577}, address:"DHA Phase II, Giga Mall, Islamabad",                            city:"Islamabad", hours:"10 AM – 10 PM",   phone:"051-111-225-272" },

  // FAISALABAD (5)
  { id:"a-24", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Kohinoor City",           coords:{lat:31.4350,lng:73.0680}, address:"C-12 Kohinoor City, Faisalabad",                                city:"Faisalabad",hours:"10 AM – 9 PM",    phone:"041-111-225-272" },
  { id:"a-25", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – D-Ground",                coords:{lat:31.4190,lng:73.0793}, address:"Peoples Colony Area, D-Ground, Faisalabad",                     city:"Faisalabad",hours:"10 AM – 9 PM",    phone:"041-111-225-272" },
  { id:"a-26", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Lyallpur Galleria",       coords:{lat:31.4320,lng:73.0830}, address:"East Canal Road, Faisalabad",                                   city:"Faisalabad",hours:"10 AM – 9:30 PM", phone:"041-111-225-272" },
  { id:"a-27", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Gulberg Thana Road",      coords:{lat:31.4150,lng:73.0950}, address:"Thana Road, Gulberg, Faisalabad",                               city:"Faisalabad",hours:"10 AM – 9 PM",    phone:"041-111-225-272" },
  { id:"a-28", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – C13 Jaranwala Road",      coords:{lat:31.4380,lng:73.0710}, address:"Near Ali Tower, C13 Jaranwala Road, Faisalabad",                city:"Faisalabad",hours:"10 AM – 9 PM",    phone:"041-111-225-272" },

  // MULTAN (3)
  { id:"a-29", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Gulgasht Colony",         coords:{lat:30.1820,lng:71.5040}, address:"Building No. 93/A, Opposite Post Office, Gulgasht Colony, Multan",city:"Multan",   hours:"10 AM – 9 PM",    phone:"061-111-225-272" },
  { id:"a-30", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Bosan Road",              coords:{lat:30.1650,lng:71.4870}, address:"Bosan Road, Multan",                                            city:"Multan",    hours:"10 AM – 9 PM",    phone:"061-111-225-272" },
  { id:"a-31", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Multan Cantt",            coords:{lat:30.1578,lng:71.5252}, address:"Nirala Centre, Cantt Bazaar, Multan",                           city:"Multan",    hours:"10 AM – 9 PM",    phone:"061-111-225-272" },

  // RAWALPINDI (1)
  { id:"a-32", brandId:"b-alkaram", brandName:"Alkaram Studio", outletName:"Alkaram – Saddar Rawalpindi",       coords:{lat:33.5989,lng:73.0553}, address:"Adam Jee Road, Saddar, Rawalpindi",                             city:"Rawalpindi",hours:"10 AM – 9 PM",    phone:"051-111-225-272" },

  // ══════════════════════════════════════════════════════════
  //  LIMELIGHT  (brandId: b-limelight)  — 45 outlets
  // ══════════════════════════════════════════════════════════

  // KARACHI (11)
  { id:"l-01", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Saima Jinnah Icon Mall",   coords:{lat:24.9048,lng:67.1684}, address:"Jinnah Avenue Road, Saima Jinnah Icon Mall, Malir Cantt, Karachi",            city:"Karachi",   hours:"10 AM – 10 PM",   phone:"021-111-546-354" },
  { id:"l-02", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Lucky One Mall",           coords:{lat:24.9322,lng:67.0872}, address:"Rashid Minhas Road, Lucky One Mall, Karachi",                   city:"Karachi",   hours:"10 AM – 10 PM",   phone:"021-111-546-354" },
  { id:"l-03", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Tariq Road",               coords:{lat:24.8655,lng:67.0615}, address:"Mira Center, 34/3 DCHS Tariq Road, Karachi",                    city:"Karachi",   hours:"10 AM – 9:30 PM", phone:"021-111-546-354" },
  { id:"l-04", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Malir Model Colony",       coords:{lat:24.8730,lng:67.1640}, address:"Liaquat Ali Khan Road, Malir Model Colony, Karachi",             city:"Karachi",   hours:"10 AM – 9:30 PM", phone:"021-111-546-354" },
  { id:"l-05", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Hyderi",                   coords:{lat:24.9133,lng:67.0680}, address:"12 Service Lane, Near 5 Star Roundabout, Hyderi, Karachi",       city:"Karachi",   hours:"10 AM – 9:30 PM", phone:"021-111-546-354" },
  { id:"l-06", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Atrium Mall Saddar",       coords:{lat:24.8560,lng:67.0154}, address:"Atrium Mall, Saddar, Karachi",                                  city:"Karachi",   hours:"10 AM – 9 PM",    phone:"021-111-546-354" },
  { id:"l-07", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Com 3 Mall Clifton",       coords:{lat:24.8490,lng:67.0340}, address:"Near BBQ Tonight, Clifton, Karachi",                            city:"Karachi",   hours:"10 AM – 10 PM",   phone:"021-111-546-354" },
  { id:"l-08", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Dolmen Mall Karachi",      coords:{lat:24.8022,lng:67.0299}, address:"Dolmen Mall Clifton, Karachi",                                  city:"Karachi",   hours:"10 AM – 10 PM",   phone:"021-111-546-354" },
  { id:"l-09", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Ocean Mall",               coords:{lat:24.8239,lng:67.0356}, address:"Ocean Mall, Clifton, Karachi",                                 city:"Karachi",   hours:"10 AM – 10 PM",   phone:"021-111-546-354" },
  { id:"l-10", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – DHA Khayaban-e-Ghalib",    coords:{lat:24.8120,lng:67.0600}, address:"15th Street DHA, Khayaban-e-Ghalib, Karachi",                   city:"Karachi",   hours:"10 AM – 9:30 PM", phone:"021-111-546-354" },
  { id:"l-11", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Station Shopping Malir",   coords:{lat:24.8920,lng:67.1950}, address:"Station Shopping Complex, Malir Cantt, Karachi",                city:"Karachi",   hours:"10 AM – 9:30 PM", phone:"021-111-546-354" },

  // LAHORE (17)
  { id:"l-12", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – MM Alam Road",             coords:{lat:31.5102,lng:74.3416}, address:"Tenth Avenue Mall, MM Alam Road, Gulberg III, Lahore",           city:"Lahore",    hours:"10 AM – 10 PM",   phone:"042-111-546-354" },
  { id:"l-13", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Allama Iqbal Town",        coords:{lat:31.4930,lng:74.3240}, address:"29 Main Boulevard Allama Iqbal Town, Lahore",                    city:"Lahore",    hours:"10 AM – 9:30 PM", phone:"042-111-546-354" },
  { id:"l-14", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Packages Mall",            coords:{lat:31.4714,lng:74.3561}, address:"1st Floor, Walton Road, Packages Mall, Lahore",                 city:"Lahore",    hours:"10 AM – 10 PM",   phone:"042-111-546-354" },
  { id:"l-15", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Johar Town",               coords:{lat:31.4627,lng:74.2741}, address:"Bilal Arcade, Abdul Haque Road, Johar Town, Lahore",             city:"Lahore",    hours:"10 AM – 10 PM",   phone:"042-111-546-354" },
  { id:"l-16", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – DHA Y-Block",              coords:{lat:31.4769,lng:74.3756}, address:"126 Y Block, DHA Phase 3, Lahore",                              city:"Lahore",    hours:"10 AM – 10 PM",   phone:"042-111-546-354" },
  { id:"l-17", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Emporium Mall",            coords:{lat:31.4678,lng:74.2664}, address:"Abdul Haque Road, Emporium Mall, Lahore",                       city:"Lahore",    hours:"10 AM – 11 PM",   phone:"042-111-546-354" },
  { id:"l-18", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Amanah Mall",              coords:{lat:31.4830,lng:74.3070}, address:"Model Town Link Road, Amanah Mall, Lahore",                     city:"Lahore",    hours:"10 AM – 9:30 PM", phone:"042-111-546-354" },
  { id:"l-19", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – EME Branch",               coords:{lat:31.4490,lng:74.3120}, address:"Mohlanwal Road, EME Society, Lahore",                           city:"Lahore",    hours:"10 AM – 9:30 PM", phone:"042-111-546-354" },
  { id:"l-20", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Gulshan-e-Ravi",           coords:{lat:31.5280,lng:74.3380}, address:"147-A Block, Gulshan-e-Ravi, Lahore",                           city:"Lahore",    hours:"10 AM – 9:30 PM", phone:"042-111-546-354" },
  { id:"l-21", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Mall of Lahore / Cantt",   coords:{lat:31.5292,lng:74.3783}, address:"Park Lane Tower, Tufail Road, Cantt, Lahore",                   city:"Lahore",    hours:"10 AM – 10 PM",   phone:"042-111-546-354" },
  { id:"l-22", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Fortress Square Mall",     coords:{lat:31.5420,lng:74.3350}, address:"Shami Road, Fortress Square Mall, Lahore",                      city:"Lahore",    hours:"10 AM – 9:30 PM", phone:"042-111-546-354" },
  { id:"l-23", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Shoppe Mall Road",         coords:{lat:31.5550,lng:74.3360}, address:"The Mall Road, Shoppe Mall, Lahore",                            city:"Lahore",    hours:"10 AM – 9:30 PM", phone:"042-111-546-354" },
  { id:"l-24", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Shadbagh",                 coords:{lat:31.5750,lng:74.3440}, address:"New Shadbagh Road, Shadbagh, Lahore",                           city:"Lahore",    hours:"10 AM – 9 PM",    phone:"042-111-546-354" },
  { id:"l-25", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Lake City Mall",           coords:{lat:31.5980,lng:74.2350}, address:"Lake City Mall, Lahore",                                        city:"Lahore",    hours:"10 AM – 10 PM",   phone:"042-111-546-354" },
  { id:"l-26", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Avenue Mall",              coords:{lat:31.4500,lng:74.2600}, address:"Near Bhatta Chowk, Avenue Mall, Lahore",                        city:"Lahore",    hours:"10 AM – 9:30 PM", phone:"042-111-546-354" },
  { id:"l-27", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Dolmen Mall Lahore",       coords:{lat:31.4650,lng:74.3810}, address:"Dolmen Mall, DHA Phase 6, Lahore",                              city:"Lahore",    hours:"10 AM – 10 PM",   phone:"042-111-546-354" },
  { id:"l-28", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Shalimar Link Road",       coords:{lat:31.5510,lng:74.3790}, address:"Shalimar Link Road, Lahore",                                    city:"Lahore",    hours:"10 AM – 9:30 PM", phone:"042-111-546-354" },

  // ISLAMABAD (6)
  { id:"l-29", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Centaurus Mall",           coords:{lat:33.7077,lng:73.0499}, address:"1st Floor, F-8, Centaurus Mall, Islamabad",                     city:"Islamabad", hours:"10 AM – 10 PM",   phone:"051-111-546-354" },
  { id:"l-30", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Safa Gold Mall",           coords:{lat:33.7200,lng:73.0520}, address:"F-7 Markaz, Safa Gold Mall, Islamabad",                         city:"Islamabad", hours:"10 AM – 9:30 PM", phone:"051-111-546-354" },
  { id:"l-31", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – F-10 Markaz",              coords:{lat:33.6980,lng:73.0130}, address:"F-10 Markaz, Islamabad",                                        city:"Islamabad", hours:"10 AM – 9 PM",    phone:"051-111-546-354" },
  { id:"l-32", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – G-9 Pak China Mall",       coords:{lat:33.6880,lng:73.0320}, address:"G-9 Pak China Mall, Islamabad",                                 city:"Islamabad", hours:"10 AM – 9:30 PM", phone:"051-111-546-354" },
  { id:"l-33", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Giga Mall DHA",            coords:{lat:33.5209,lng:73.1577}, address:"DHA Phase II, Giga Mall, GT Road, Islamabad",                   city:"Islamabad", hours:"10 AM – 10 PM",   phone:"051-111-546-354" },
  { id:"l-34", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Giga Boutique Mall",       coords:{lat:33.5215,lng:73.1580}, address:"Main GT Road, Giga Boutique Mall, Islamabad",                   city:"Islamabad", hours:"10 AM – 10 PM",   phone:"051-111-546-354" },

  // RAWALPINDI (3)
  { id:"l-35", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Rehmanabad",               coords:{lat:33.6180,lng:73.0810}, address:"Adnan Arcade Plaza, 5th Road, Rehmanabad, Rawalpindi",           city:"Rawalpindi",hours:"10 AM – 9:30 PM", phone:"051-111-546-354" },
  { id:"l-36", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Saddar Rawalpindi",        coords:{lat:33.5989,lng:73.0553}, address:"Axis Center, Bank Road, Saddar, Rawalpindi",                    city:"Rawalpindi",hours:"10 AM – 9 PM",    phone:"051-111-546-354" },
  { id:"l-37", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Amazon Mall DHA 2",        coords:{lat:33.5600,lng:73.1180}, address:"Amazon Mall, DHA Phase 2, Rawalpindi",                          city:"Rawalpindi",hours:"10 AM – 10 PM",   phone:"051-111-546-354" },

  // FAISALABAD (5)
  { id:"l-38", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Kohinoor Plaza",           coords:{lat:31.4350,lng:73.0680}, address:"Jaranwala Road, Kohinoor Plaza, Faisalabad",                    city:"Faisalabad",hours:"10 AM – 9 PM",    phone:"041-111-546-354" },
  { id:"l-39", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – D-Ground",                 coords:{lat:31.4190,lng:73.0793}, address:"Harianwala Chowk, D-Ground, Faisalabad",                        city:"Faisalabad",hours:"10 AM – 9 PM",    phone:"041-111-546-354" },
  { id:"l-40", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Grand Atrium Mall",        coords:{lat:31.4280,lng:73.0650}, address:"West Canal Road, Grand Atrium Mall, Faisalabad",                city:"Faisalabad",hours:"10 AM – 10 PM",   phone:"041-111-546-354" },
  { id:"l-41", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Grand Gulberg",            coords:{lat:31.4320,lng:73.0830}, address:"Main Gulberg Road, Faisalabad",                                 city:"Faisalabad",hours:"10 AM – 9:30 PM", phone:"041-111-546-354" },
  { id:"l-42", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Galleria East Canal",      coords:{lat:31.4300,lng:73.0670}, address:"East Canal Road, Galleria, Faisalabad",                         city:"Faisalabad",hours:"10 AM – 9:30 PM", phone:"041-111-546-354" },

  // MULTAN (3)
  { id:"l-43", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Gulgasht Colony",          coords:{lat:30.1820,lng:71.5040}, address:"Near Pizza Hut, Gulgasht Colony, Multan",                       city:"Multan",    hours:"10 AM – 9:30 PM", phone:"061-111-546-354" },
  { id:"l-44", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Abdali Road Multan",       coords:{lat:30.1575,lng:71.5249}, address:"Abdali Road, Multan",                                           city:"Multan",    hours:"10 AM – 9 PM",    phone:"061-111-546-354" },
  { id:"l-45", brandId:"b-limelight", brandName:"Limelight", outletName:"Limelight – Mall of Multan",           coords:{lat:30.1900,lng:71.4780}, address:"Near Toyota Motors, Mall of Multan",                            city:"Multan",    hours:"10 AM – 10 PM",   phone:"061-111-546-354" },

  // ══════════════════════════════════════════════════════════
  //  ZELLBURY  (brandId: b-zellbury)  — 20 outlets
  // ══════════════════════════════════════════════════════════

  // KARACHI (10)
  { id:"z-01", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – Jinnah Icon Mall",            coords:{lat:24.9048,lng:67.1684}, address:"Main Jinnah Avenue Road, Jinnah Icon Mall, Malir Cantt, Karachi",             city:"Karachi",   hours:"10 AM – 10 PM",   phone:"+92-21-3840-2072" },
  { id:"z-02", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – Shaheed-e-Millat Flagship",   coords:{lat:24.8780,lng:67.0640}, address:"Makkah Tower, 230 Shaheed-e-Millat Road, Karachi",              city:"Karachi",   hours:"10 AM – 9:30 PM", phone:"+92-21-3840-2072" },
  { id:"z-03", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – Shahrah-e-Faisal",            coords:{lat:24.8920,lng:67.0760}, address:"G-33 Shahrah-e-Faisal, Karachi",                                city:"Karachi",   hours:"10 AM – 9:30 PM", phone:"+92-21-3840-2072" },
  { id:"z-04", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – KDA Market Gulshan",          coords:{lat:24.9240,lng:67.0890}, address:"Block 3, Allama Shabbir Ahmed Usmani Road, KDA Market, Karachi", city:"Karachi",   hours:"10 AM – 9:30 PM", phone:"+92-21-3840-2072" },
  { id:"z-05", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – National Stadium Road",       coords:{lat:24.8960,lng:67.0580}, address:"Near Askari IV, National Stadium Road, Karachi",                city:"Karachi",   hours:"10 AM – 9:30 PM", phone:"+92-21-3840-2072" },
  { id:"z-06", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – University Road",             coords:{lat:24.9259,lng:67.0939}, address:"Opposite PIA Planetarium, University Road, Karachi",            city:"Karachi",   hours:"10 AM – 9:30 PM", phone:"+92-21-3840-2072" },
  { id:"z-07", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – Saima Paari Center",          coords:{lat:24.9280,lng:67.0700}, address:"Saima Paari Center, North Nazimabad, Karachi",                  city:"Karachi",   hours:"10 AM – 9:30 PM", phone:"+92-21-3840-2072" },
  { id:"z-08", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – Lucky One Mall",              coords:{lat:24.9322,lng:67.0872}, address:"1st Floor, Lucky One Mall, Karachi",                            city:"Karachi",   hours:"10 AM – 10 PM",   phone:"+92-21-3840-2072" },
  { id:"z-09", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – Atrium Mall Saddar",          coords:{lat:24.8560,lng:67.0154}, address:"2nd Floor, Zaibunnisa Street, Atrium Mall, Karachi",             city:"Karachi",   hours:"10 AM – 9 PM",    phone:"+92-21-3840-2072" },
  { id:"z-10", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – Square One Mall",             coords:{lat:24.8960,lng:67.0570}, address:"Main National Stadium Road, Near Askari IV, Karachi",           city:"Karachi",   hours:"10 AM – 10 PM",   phone:"+92-21-3840-2072" },

  // LAHORE (5)
  { id:"z-11", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – Emporium Mall",               coords:{lat:31.4678,lng:74.2664}, address:"Shop No. F-17, Abdul Haque Road, Emporium Mall, Lahore",        city:"Lahore",    hours:"10 AM – 10 PM",   phone:"+92-21-3840-2072" },
  { id:"z-12", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – Fortress Square Mall",        coords:{lat:31.5420,lng:74.3350}, address:"LG Floor, Fortress Square Mall, Lahore",                       city:"Lahore",    hours:"10 AM – 9:30 PM", phone:"+92-21-3840-2072" },
  { id:"z-13", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – Model Town Link Road",        coords:{lat:31.4830,lng:74.3070}, address:"Opposite Zainab Tower, Model Town Link Road, Lahore",           city:"Lahore",    hours:"10 AM – 9:30 PM", phone:"+92-21-3840-2072" },
  { id:"z-14", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – Packages Mall",               coords:{lat:31.4714,lng:74.3561}, address:"2nd Floor, Walton Road, Packages Mall, Lahore",                city:"Lahore",    hours:"10 AM – 10 PM",   phone:"+92-21-3840-2072" },
  { id:"z-15", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – Shadbagh Road",               coords:{lat:31.5750,lng:74.3440}, address:"Shadbagh Road, Lahore",                                        city:"Lahore",    hours:"10 AM – 9 PM",    phone:"+92-21-3840-2072" },

  // ISLAMABAD (2)
  { id:"z-16", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – Centaurus Mall",              coords:{lat:33.7077,lng:73.0499}, address:"3rd Floor, Centaurus Mall, Islamabad",                          city:"Islamabad", hours:"10 AM – 10 PM",   phone:"+92-21-3840-2072" },
  { id:"z-17", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – Capital Square Mall B-17",    coords:{lat:33.6820,lng:72.9780}, address:"Multi Gardens B-17, Capital Square Mall, Islamabad",            city:"Islamabad", hours:"10 AM – 9:30 PM", phone:"+92-21-3840-2072" },

  // RAWALPINDI (1)
  { id:"z-18", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – PWD Road",                   coords:{lat:33.5720,lng:73.0980}, address:"Near Nishat Linen, PWD Society, Rawalpindi",                    city:"Rawalpindi",hours:"10 AM – 9 PM",    phone:"+92-21-3840-2072" },

  // FAISALABAD (1)
  { id:"z-19", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – Kohinoor City",               coords:{lat:31.4350,lng:73.0680}, address:"Commercial Market 1 & 2, Jaranwala Road, Kohinoor City, Faisalabad", city:"Faisalabad", hours:"10 AM – 9 PM", phone:"+92-21-3840-2072" },

  // MULTAN (1)
  { id:"z-20", brandId:"b-zellbury", brandName:"Zellbury", outletName:"Zellbury – Gulgasht Colony",             coords:{lat:30.1820,lng:71.5040}, address:"A Block, Gulgasht Colony, Multan",                              city:"Multan",    hours:"10 AM – 9 PM",    phone:"+92-21-3840-2072" },

];

export default outlets;