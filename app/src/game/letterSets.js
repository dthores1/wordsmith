const RAW = [
  "birdcage", "manequin", "exorcist", "unstring", "misproud", "kickable",
  "exurgent", "liftable", "illusory", "bronzing", "riddling", "doretree",
  "margined", "pithsome", "plantain", "outbuild", "sursolid", "stranger",
  "clubhand", "singsong", "wagering", "unwormed", "petuntse", "engregge",
  "raftsman", "severity", "shamrock", "combined", "gyneceum", "fridstol",
  "gemmeous", "temperer", "cylinder", "seedcake", "sickless", "crossbow",
  "hesitate", "thereout", "idealism", "asphyxia", "disserve", "sportule",
  "naufrage", "yokemate", "jehovist", "strigine", "carbonic", "syphilis",
  "chaldaic", "ligneous", "opponent", "fumigant", "babyhood", "leporine",
  "sagenite", "propense", "shingler", "chasuble", "kistvaen", "bleacher",
  "moulinet", "reassume", "famously", "diluvium", "outskirt", "sunburst",
  "rhonchal", "platting", "plumbing", "straught", "debutant", "palmetto",
  "coagency", "barehead", "impolicy", "behappen", "stycerin", "seabeach",
  "rubbidge", "digitate", "overwork", "evangely", "sonorous", "adscript",
  "paraxial", "traveled", "trustful", "ornament", "culerage", "unpitied",
  "aphetism", "mistrust", "enthrill", "encyclic", "scurvily", "corncrib",
  "tripping", "albinism", "aquosity", "eyereach", "subnasal", "notwheat",
  "cannoned", "chrysopa", "ignorant", "modalist", "lavender", "grimness",
  "property", "rambling", "sightful", "banality", "inactose", "trihoral",
  "reprieve", "snappish", "oversoon", "hyperion", "tentacle", "mandamus",
  "fetidity", "episodic", "rostrate", "overfish", "flathead", "unruffle",
  "janthina", "tannigen", "laureled", "function", "glonoine", "narrowly",
  "chesible", "welldoer", "pediment", "ceterach", "intended", "brimless",
  "notebook", "thespian", "celibate", "practico", "royalism", "evaluate",
  "natantly", "wickered", "blazonry", "receiver", "unkemmed", "pannikel",
  "swellish", "footstep", "homelike", "vitalist", "splutter", "crossway",
  "leathery", "drumhead", "matronly", "halteres", "novelism", "trickery",
  "slapping", "editress", "coasting", "nutrient", "mandible", "systemic",
  "exposure", "fameless", "squatter", "gainsome", "overbend", "rustless",
  "adhesion", "pipewood", "reprisal", "headwind", "homeland", "accurate",
  "deadline", "discover", "estimate", "hardware", "overseas", "software",
  "skipjack", "equalize", "blackbox", "yourself", "wherever", "turnover",
  "weakness", "thousand", "transfer", "somewhat", "chopping", "anything",
  "becoming", "fourteen", "overhead", "wizardly", "purchase", "strategy",
  "sweeping", "stunning", "unlikely", "withdraw", "saveable", "wireless",
  "wildlife", "distance", "prefixes", "shoplift",
];

export const LETTER_SETS = Array.from(
  new Set(
    RAW
      .map((s) => s.toLowerCase())
      .filter((s) => /^[a-z]{8}$/.test(s))
  )
);
