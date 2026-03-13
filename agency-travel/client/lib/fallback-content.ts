const formatPrice = (value: number) =>
  value.toLocaleString("fr-FR").replace(/[\u202f\u00a0,]/g, " ");

const buildGallery = (...imageUrls: string[]) =>
  imageUrls.map((imageUrl) => ({ imageUrl }));

const buildAmenities = (items: string[]) => items.map((item) => ({ item }));

const buildHotel = ({
  id,
  offerId,
  offerSlug,
  offerDestination,
  name,
  description,
  stars = 4,
  dates,
  priceAmount,
  mainImageUrl,
  galleryUrls,
  city,
  country,
  address,
  amenities,
  rating = 4.6,
  transferIncluded = true,
  breakfastIncluded = true,
}: {
  id: string;
  offerId: string;
  offerSlug: string;
  offerDestination: string;
  name: string;
  description: string;
  stars?: number;
  dates: string;
  priceAmount: number;
  mainImageUrl: string;
  galleryUrls: string[];
  city: string;
  country: string;
  address: string;
  amenities: string[];
  rating?: number;
  transferIncluded?: boolean;
  breakfastIncluded?: boolean;
}) => {
  const price = formatPrice(priceAmount);
  const childPriceAmount = Math.round(priceAmount * 0.72);

  return {
    id,
    name,
    description,
    stars,
    dates,
    price,
    priceAmount,
    currency: "DZD",
    pricePerPerson: price,
    childPrice: formatPrice(childPriceAmount),
    childPriceAmount,
    childPriceBrackets: [
      { label: "Enfant 0-2 ans", minAge: 0, maxAge: 2, priceAmount: 0 },
      {
        label: "Enfant 3-5 ans",
        minAge: 3,
        maxAge: 5,
        priceAmount: Math.round(childPriceAmount * 0.65),
      },
      {
        label: "Enfant 6-11 ans",
        minAge: 6,
        maxAge: 11,
        priceAmount: childPriceAmount,
      },
    ],
    mainImageUrl,
    images: buildGallery(mainImageUrl, ...galleryUrls),
    rating,
    address,
    city,
    country,
    amenities: buildAmenities(amenities),
    transferIncluded,
    breakfastIncluded,
    offers: [{ id: offerId, slug: offerSlug, destination: offerDestination }],
  };
};

const buildProgramDay = ({
  dayLabel,
  title,
  description,
  imageUrl,
  location,
  meal,
  isLast = false,
}: {
  dayLabel: string;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  meal: string;
  isLast?: boolean;
}) => ({
  dayLabel,
  title,
  description,
  locations: [{ place: location }],
  meals: [{ meal }],
  images: buildGallery(imageUrl),
  isLast,
});

const buildOffer = ({
  id,
  slug,
  title,
  destination,
  country,
  flag,
  region,
  shortDescription,
  mainImageUrl,
  galleryUrls,
  dates,
  startDate,
  durationDays,
  priceAmount,
  tag,
  badge,
  badgeVariant,
  status,
  showOnHomepage,
  departureLocation,
  location,
  time,
  hotel,
  program,
}: {
  id: string;
  slug: string;
  title: string;
  destination: string;
  country: string;
  flag: string;
  region: string;
  shortDescription: string;
  mainImageUrl: string;
  galleryUrls: string[];
  dates: string;
  startDate: string;
  durationDays: number;
  priceAmount: number;
  tag: string;
  badge: string;
  badgeVariant: "info" | "warning" | "danger";
  status: string;
  showOnHomepage: boolean;
  departureLocation: string;
  location: string;
  time: string;
  hotel: {
    id: string;
    name: string;
    description: string;
    stars?: number;
    mainImageUrl: string;
    galleryUrls: string[];
    city: string;
    country: string;
    address: string;
    amenities: string[];
    rating?: number;
    transferIncluded?: boolean;
    breakfastIncluded?: boolean;
  };
  program: Array<{
    dayLabel: string;
    title: string;
    description: string;
    imageUrl: string;
    location: string;
    meal: string;
    isLast?: boolean;
  }>;
}) => {
  const price = formatPrice(priceAmount);
  const childrenPricing = [
    { label: "Enfant 3-5 ans", priceAmount: Math.round(priceAmount * 0.42) },
    { label: "Enfant 6-11 ans", priceAmount: Math.round(priceAmount * 0.72) },
  ];

  return {
    id,
    slug,
    title,
    destination,
    country,
    flag,
    region,
    shortDescription,
    mainImageUrl,
    galleryImages: buildGallery(mainImageUrl, ...galleryUrls),
    dates,
    startDate,
    metaDates: dates,
    metaDuration: `${durationDays} jours`,
    duration: `${durationDays} jours`,
    durationDays,
    numberOfDays: durationDays,
    price,
    priceAmount,
    currency: "DZD",
    childrenPricing,
    priceSummary:
      "Tarif indicatif par adulte, au départ d'Alger. Le tarif final est reconfirme selon les disponibilites hotelieres et aeriennes.",
    priceCard: {
      description:
        "Vol, hebergement et coordination du dossier inclus. Notre equipe vous rappelle avant confirmation finale.",
      travellersLabel: "Voyageurs",
      defaultAdults: 2,
      travellersText: "Adaptez le nombre d'adultes et d'enfants avant envoi de la demande.",
      detailsTitle: "Ce tarif comprend",
      totalLabel: "Total estime",
      reserveButtonLabel: "Demander cette offre",
      confirmationText: "Confirmation sous 24h ouvrees par notre equipe.",
    },
    departureLocation,
    location,
    time,
    tag,
    badge,
    badgeVariant,
    status,
    showOnHomepage,
    inclusions: [
      { item: "Vol aller / retour", icon: "plane" },
      { item: "Hotel selectionne", icon: "hotel" },
      { item: "Transferts aeroport", icon: "transfer" },
      { item: "Assistance dossier", icon: "assistance" },
    ],
    exclusions: [
      { item: "Depenses personnelles" },
      { item: "Options non mentionnees au programme" },
    ],
    program: program.map((entry) => buildProgramDay(entry)),
    hotels: [
      buildHotel({
        id: hotel.id,
        offerId: id,
        offerSlug: slug,
        offerDestination: destination,
        name: hotel.name,
        description: hotel.description,
        stars: hotel.stars,
        dates,
        priceAmount,
        mainImageUrl: hotel.mainImageUrl,
        galleryUrls: hotel.galleryUrls,
        city: hotel.city,
        country: hotel.country,
        address: hotel.address,
        amenities: hotel.amenities,
        rating: hotel.rating,
        transferIncluded: hotel.transferIncluded,
        breakfastIncluded: hotel.breakfastIncluded,
      }),
    ],
  };
};

const SKYLINE = "/assets/figma/47915728ec2c232de145d04fe195c0cf46027056.jpg";
const CITY_STREET = "/assets/figma/41f508fbba5d9a76394c60f6d497d92a6820690a.jpg";
const JUNGLE = "/assets/figma/59963752338377140a89306e9be22526a08262a9.jpg";
const BEACH_RESORT = "/assets/figma/7d83481de93cb3515133271899e0d62e56c401e5.jpg";
const DESERT = "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg";
const ATV = "/assets/figma/cf0410856b991c188fcf3b7f24a87b6fed7eb6e8.jpg";
const POOL = "/assets/figma/37c823577edb4dbdc73e687407625fd87908430a.jpg";
const KAYAK = "/assets/figma/910cc56e7171f85753f9a3f9629a2e27c588c472.jpg";
const TROPICAL = "/assets/figma/b4365b4213a1ab3ed63291bf2cf4d1f00b6c6c4e.jpg";
const BEACH = "/assets/figma/d1d2e746586963a4fd04eb564c23aa979fa68946.jpg";
const TAJ = "/assets/figma/taj.png";
const COLOSSEUM = "/assets/figma/colosseum.png";
const EIFFEL = "/assets/figma/eiffel.png";
const PYRAMIDS = "/assets/figma/pyramids.png";
const PYRAMIDS_OASIS = "/assets/figma/pyramids-oasis.png";
const PETRA = "/assets/figma/petra.png";
const PETRA_CANYON = "/assets/figma/petra-canyon.png";
const AIRPORT = "/assets/figma/airport.png";
const CAPADOCIA = "/assets/figma/cappadocia.png";

export const fallbackFaqs = [
  {
    id: "faq-1",
    question: "Quels documents faut-il pour reserver un voyage ?",
    answer:
      "Une copie du passeport, un numero de telephone joignable et le reglement de l'acompte suffisent pour lancer le dossier. L'equipe vous confirme ensuite les pieces eventuelles selon la destination.",
    order: 1,
  },
  {
    id: "faq-2",
    question: "Est-ce que le vol, l'hotel et les transferts sont inclus ?",
    answer:
      "Oui, la plupart des offres affichees incluent le vol aller-retour, l'hotel et les transferts. Les inclusions exactes sont reprises sur chaque offre avant confirmation.",
    order: 2,
  },
  {
    id: "faq-3",
    question: "Puis-je demander un voyage sur mesure ?",
    answer:
      "Oui. Le formulaire de voyage sur mesure permet d'indiquer la destination, le budget, les dates et le nombre de voyageurs pour recevoir une proposition adaptee.",
    order: 3,
  },
  {
    id: "faq-4",
    question: "Comment se passe la confirmation apres la demande ?",
    answer:
      "Apres l'envoi de la demande, l'agence reprend contact pour confirmer les disponibilites, le tarif final et les etapes de paiement avant emission.",
    order: 4,
  },
  {
    id: "faq-5",
    question: "Est-ce que vous accompagnez pour le visa quand il est necessaire ?",
    answer:
      "Oui. Selon la destination, nous vous indiquons les pieces a preparer, les delais a prevoir et les points de vigilance avant le depot du dossier.",
    order: 5,
  },
  {
    id: "faq-6",
    question: "Peut-on payer en plusieurs fois ?",
    answer:
      "Un acompte permet de bloquer le dossier puis le solde est regle avant depart selon l'echeancier confirme avec l'agence et les disponibilites du moment.",
    order: 6,
  },
  {
    id: "faq-7",
    question: "Que se passe-t-il si je dois annuler ou modifier mon voyage ?",
    answer:
      "Chaque dossier est etudie selon les conditions du billet, de l'hotel et des prestataires. L'equipe vous indique rapidement les frais ou options de modification possibles.",
    order: 7,
  },
];

export const fallbackOfferDetails = [
  buildOffer({
    id: "fallback-istanbul",
    slug: "istanbul-escapade",
    title: "Istanbul Escapade",
    destination: "Istanbul",
    country: "Turquie",
    flag: "🇹🇷",
    region: "Turquie",
    shortDescription:
      "Un city break rythmé entre les quartiers historiques, les croisières sur le Bosphore et une adresse d'hotel centrale.",
    mainImageUrl: SKYLINE,
    galleryUrls: [CITY_STREET, PETRA, AIRPORT],
    dates: "12 - 18 avril 2026",
    startDate: "2026-04-12",
    durationDays: 7,
    priceAmount: 145000,
    tag: "Populaire",
    badge: "Disponible",
    badgeVariant: "info",
    status: "available",
    showOnHomepage: true,
    departureLocation: "Depart Alger",
    location: "Sultanahmet & Bosphore",
    time: "Vol direct + transferts inclus",
    hotel: {
      id: "hotel-golden-horn",
      name: "Golden Horn Hotel",
      description:
        "Boutique hotel 4 etoiles proche des sites majeurs, ideal pour un sejour court et bien situe.",
      stars: 4,
      mainImageUrl: CITY_STREET,
      galleryUrls: [SKYLINE, POOL],
      city: "Istanbul",
      country: "Turquie",
      address: "Sirkeci, Fatih, Istanbul",
      amenities: ["Wifi", "Petit dejeuner", "Navette aeroport"],
      rating: 4.5,
    },
    program: [
      {
        dayLabel: "Jour 1",
        title: "Arrivee et installation",
        description: "Accueil a l'aeroport puis installation a l'hotel avant une premiere soiree libre dans le vieux centre.",
        imageUrl: CITY_STREET,
        location: "Sultanahmet",
        meal: "Libre",
      },
      {
        dayLabel: "Jour 2",
        title: "Croisiere sur le Bosphore",
        description: "Decouverte des rives europeennes et asiatiques puis temps libre pour shopping et restauration.",
        imageUrl: SKYLINE,
        location: "Bosphore",
        meal: "Petit dejeuner",
        isLast: true,
      },
    ],
  }),
  buildOffer({
    id: "fallback-dubai",
    slug: "dubai-signature",
    title: "Dubai Signature",
    destination: "Dubai",
    country: "Emirats arabes unis",
    flag: "🇦🇪",
    region: "Moyen-Orient",
    shortDescription:
      "Une formule premium pour profiter des quartiers iconiques de Dubai avec hotel confortable et transferts coordonnes.",
    mainImageUrl: CITY_STREET,
    galleryUrls: [SKYLINE, POOL, BEACH],
    dates: "03 - 08 mai 2026",
    startDate: "2026-05-03",
    durationDays: 6,
    priceAmount: 198000,
    tag: "Nouveau",
    badge: "Places limitees",
    badgeVariant: "warning",
    status: "almost-full",
    showOnHomepage: true,
    departureLocation: "Depart Alger",
    location: "Downtown & Marina",
    time: "Vol + assistance sur place",
    hotel: {
      id: "hotel-marina-sky",
      name: "Marina Sky Resort",
      description:
        "Hotel 5 etoiles avec vues sur la marina, acces rapide aux malls et services adaptes aux sejours familles.",
      stars: 5,
      mainImageUrl: POOL,
      galleryUrls: [CITY_STREET, BEACH],
      city: "Dubai",
      country: "Emirats arabes unis",
      address: "Dubai Marina Walk",
      amenities: ["Piscine", "Petit dejeuner", "Navette"],
      rating: 4.7,
    },
    program: [
      {
        dayLabel: "Jour 1",
        title: "Arrivee a Dubai",
        description: "Transfert vers l'hotel puis temps libre pour une premiere promenade dans la marina.",
        imageUrl: SKYLINE,
        location: "Dubai Marina",
        meal: "Libre",
      },
      {
        dayLabel: "Jour 2",
        title: "Downtown et Dubai Mall",
        description: "Journee libre ou accompagnee pour explorer Downtown, les fontaines et les grands centres d'interet.",
        imageUrl: CITY_STREET,
        location: "Downtown Dubai",
        meal: "Petit dejeuner",
        isLast: true,
      },
    ],
  }),
  buildOffer({
    id: "fallback-cairo",
    slug: "caire-pyramides",
    title: "Le Caire & Pyramides",
    destination: "Le Caire",
    country: "Egypte",
    flag: "🇪🇬",
    region: "Afrique",
    shortDescription:
      "Une parenthese culturelle entre les sites antiques, la ville historique et un hotel proche des grands axes.",
    mainImageUrl: PYRAMIDS,
    galleryUrls: [PYRAMIDS_OASIS, DESERT, AIRPORT],
    dates: "20 - 25 juin 2026",
    startDate: "2026-06-20",
    durationDays: 6,
    priceAmount: 132000,
    tag: "Culture",
    badge: "Disponible",
    badgeVariant: "info",
    status: "available",
    showOnHomepage: true,
    departureLocation: "Depart Alger",
    location: "Gizeh & vieux Caire",
    time: "Vol avec assistance francophone",
    hotel: {
      id: "hotel-nile-view",
      name: "Nile View Hotel",
      description:
        "Adresse 4 etoiles pratique pour alterner visites culturelles, sorties et transferts simplifies.",
      stars: 4,
      mainImageUrl: DESERT,
      galleryUrls: [PYRAMIDS_OASIS, SKYLINE],
      city: "Le Caire",
      country: "Egypte",
      address: "Corniche El Nil, Le Caire",
      amenities: ["Wifi", "Petit dejeuner", "Excursions"],
      rating: 4.4,
    },
    program: [
      {
        dayLabel: "Jour 1",
        title: "Installation et premiere decouverte",
        description: "Accueil puis premiere immersion dans l'ambiance du Caire avec soiree libre.",
        imageUrl: DESERT,
        location: "Centre-ville",
        meal: "Libre",
      },
      {
        dayLabel: "Jour 2",
        title: "Plateau de Gizeh",
        description: "Visite des pyramides et temps dedie aux prises de vues avant retour a l'hotel.",
        imageUrl: PYRAMIDS,
        location: "Gizeh",
        meal: "Petit dejeuner",
        isLast: true,
      },
    ],
  }),
  buildOffer({
    id: "fallback-kuala-lumpur",
    slug: "kuala-lumpur-discovery",
    title: "Kuala Lumpur Discovery",
    destination: "Kuala Lumpur",
    country: "Malaisie",
    flag: "🇲🇾",
    region: "Asie",
    shortDescription:
      "Un sejour urbain complet pour combiner shopping, gourmandise et reperes faciles dans la capitale malaisienne.",
    mainImageUrl: JUNGLE,
    galleryUrls: [SKYLINE, KAYAK, TROPICAL],
    dates: "07 - 14 juillet 2026",
    startDate: "2026-07-07",
    durationDays: 8,
    priceAmount: 221000,
    tag: "Tendance",
    badge: "Disponible",
    badgeVariant: "info",
    status: "available",
    showOnHomepage: true,
    departureLocation: "Depart Alger",
    location: "Bukit Bintang",
    time: "Vol avec escale + transferts",
    hotel: {
      id: "hotel-bukit-bintang",
      name: "Bukit Bintang Suites",
      description:
        "Hotel central pour profiter des centres commerciaux, des restaurants et des liaisons rapides dans la ville.",
      stars: 4,
      mainImageUrl: TROPICAL,
      galleryUrls: [JUNGLE, SKYLINE],
      city: "Kuala Lumpur",
      country: "Malaisie",
      address: "Bukit Bintang, Kuala Lumpur",
      amenities: ["Piscine", "Wifi", "Petit dejeuner"],
      rating: 4.6,
    },
    program: [
      {
        dayLabel: "Jour 1",
        title: "Check-in et tour d'orientation",
        description: "Installation puis tour libre du quartier pour prendre vos reperes en douceur.",
        imageUrl: SKYLINE,
        location: "Bukit Bintang",
        meal: "Libre",
      },
      {
        dayLabel: "Jour 2",
        title: "Tours Petronas et shopping",
        description: "Journee dediee aux incontournables modernes de Kuala Lumpur avec temps libre en fin de journee.",
        imageUrl: JUNGLE,
        location: "KLCC",
        meal: "Petit dejeuner",
        isLast: true,
      },
    ],
  }),
  buildOffer({
    id: "fallback-rome",
    slug: "rome-classique",
    title: "Rome Classique",
    destination: "Rome",
    country: "Italie",
    flag: "🇮🇹",
    region: "Europe",
    shortDescription:
      "Un format efficace pour profiter des quartiers historiques, des places majeures et d'un hotel bien positionne.",
    mainImageUrl: COLOSSEUM,
    galleryUrls: [CITY_STREET, SKYLINE, BEACH_RESORT],
    dates: "15 - 19 septembre 2026",
    startDate: "2026-09-15",
    durationDays: 5,
    priceAmount: 174000,
    tag: "Europe",
    badge: "Disponible",
    badgeVariant: "info",
    status: "available",
    showOnHomepage: true,
    departureLocation: "Depart Alger",
    location: "Colisee & centre historique",
    time: "Vol direct + navette",
    hotel: {
      id: "hotel-colosseo-central",
      name: "Colosseo Central Inn",
      description:
        "Une adresse 4 etoiles confortable, pratique pour rejoindre a pied plusieurs monuments phares.",
      stars: 4,
      mainImageUrl: BEACH_RESORT,
      galleryUrls: [COLOSSEUM, CITY_STREET],
      city: "Rome",
      country: "Italie",
      address: "Via Cavour, Rome",
      amenities: ["Wifi", "Petit dejeuner", "Reception 24/7"],
      rating: 4.5,
    },
    program: [
      {
        dayLabel: "Jour 1",
        title: "Installation et premiere balade",
        description: "Arrivee puis promenade libre autour du Colisee et des rues animees du centre.",
        imageUrl: COLOSSEUM,
        location: "Rome centre",
        meal: "Libre",
      },
      {
        dayLabel: "Jour 2",
        title: "Classiques romains",
        description: "Temps libre pour la fontaine de Trevi, la piazza Navona et les quartiers historiques.",
        imageUrl: CITY_STREET,
        location: "Centre historique",
        meal: "Petit dejeuner",
        isLast: true,
      },
    ],
  }),
  buildOffer({
    id: "fallback-marrakech",
    slug: "marrakech-riad-escape",
    title: "Marrakech Riad Escape",
    destination: "Marrakech",
    country: "Maroc",
    flag: "🇲🇦",
    region: "Afrique",
    shortDescription:
      "Une escapade chaleureuse entre riad, medina, jardins et ambiance locale, avec logistique simple depuis Alger.",
    mainImageUrl: ATV,
    galleryUrls: [DESERT, CITY_STREET, AIRPORT],
    dates: "02 - 07 octobre 2026",
    startDate: "2026-10-02",
    durationDays: 6,
    priceAmount: 118000,
    tag: "Weekend +",
    badge: "Disponible",
    badgeVariant: "info",
    status: "available",
    showOnHomepage: false,
    departureLocation: "Depart Alger",
    location: "Medina & Palmeraie",
    time: "Vol direct + assistance locale",
    hotel: {
      id: "hotel-atlas-medina",
      name: "Atlas Medina Riad",
      description:
        "Riad 4 etoiles au decor traditionnel, parfait pour un court sejour de depaysement et de confort.",
      stars: 4,
      mainImageUrl: DESERT,
      galleryUrls: [ATV, POOL],
      city: "Marrakech",
      country: "Maroc",
      address: "Medina, Marrakech",
      amenities: ["Petit dejeuner", "Patio", "Transfert aeroport"],
      rating: 4.4,
    },
    program: [
      {
        dayLabel: "Jour 1",
        title: "Arrivee et installation au riad",
        description: "Accueil puis temps libre dans la medina pour une premiere immersion.",
        imageUrl: ATV,
        location: "Medina",
        meal: "Libre",
      },
      {
        dayLabel: "Jour 2",
        title: "Jardins et souks",
        description: "Journee entre balades, achats artisanaux et pauses gourmandes selon votre rythme.",
        imageUrl: DESERT,
        location: "Marrakech",
        meal: "Petit dejeuner",
        isLast: true,
      },
    ],
  }),
  buildOffer({
    id: "fallback-antalya",
    slug: "antalya-blue-coast",
    title: "Antalya Blue Coast",
    destination: "Antalya",
    country: "Turquie",
    flag: "🇹🇷",
    region: "Turquie",
    shortDescription:
      "Un sejour balneaire simple a vendre, avec hotel resort, mer et transferts pour une experience detente.",
    mainImageUrl: BEACH,
    galleryUrls: [POOL, BEACH_RESORT, CAPADOCIA],
    dates: "15 - 21 juin 2026",
    startDate: "2026-06-15",
    durationDays: 7,
    priceAmount: 169000,
    tag: "Ete",
    badge: "Disponible",
    badgeVariant: "info",
    status: "available",
    showOnHomepage: false,
    departureLocation: "Depart Alger",
    location: "Lara Beach",
    time: "Vol direct + transferts resort",
    hotel: {
      id: "hotel-lara-beach",
      name: "Lara Beach Palace",
      description:
        "Resort 5 etoiles en bord de mer, adapte aux familles et aux clients qui veulent une formule facile.",
      stars: 5,
      mainImageUrl: BEACH_RESORT,
      galleryUrls: [BEACH, POOL],
      city: "Antalya",
      country: "Turquie",
      address: "Lara, Antalya",
      amenities: ["Piscine", "Plage", "Petit dejeuner"],
      rating: 4.7,
    },
    program: [
      {
        dayLabel: "Jour 1",
        title: "Arrivee et prise en main du resort",
        description: "Transfert prive, check-in puis apres-midi libre en bord de mer.",
        imageUrl: BEACH,
        location: "Lara Beach",
        meal: "Libre",
      },
      {
        dayLabel: "Jour 2",
        title: "Journée détente",
        description: "Profitez des installations du resort ou organisez une sortie optionnelle selon vos envies.",
        imageUrl: POOL,
        location: "Antalya",
        meal: "Petit dejeuner",
        isLast: true,
      },
    ],
  }),
  buildOffer({
    id: "fallback-doha",
    slug: "doha-weekender",
    title: "Doha Weekender",
    destination: "Doha",
    country: "Qatar",
    flag: "🇶🇦",
    region: "Moyen-Orient",
    shortDescription:
      "Une formule courte, propre et facile a vendre pour un week-end shopping et decouverte dans un cadre moderne.",
    mainImageUrl: SKYLINE,
    galleryUrls: [CITY_STREET, POOL, AIRPORT],
    dates: "06 - 10 novembre 2026",
    startDate: "2026-11-06",
    durationDays: 5,
    priceAmount: 156000,
    tag: "Court sejour",
    badge: "Disponible",
    badgeVariant: "info",
    status: "available",
    showOnHomepage: false,
    departureLocation: "Depart Alger",
    location: "Corniche & Souq Waqif",
    time: "Vol + navette a l'hotel",
    hotel: {
      id: "hotel-pearl-corniche",
      name: "Pearl Corniche Hotel",
      description:
        "Hotel 4 etoiles moderne avec acces rapide aux quartiers les plus pratiques pour un sejour express.",
      stars: 4,
      mainImageUrl: CITY_STREET,
      galleryUrls: [SKYLINE, POOL],
      city: "Doha",
      country: "Qatar",
      address: "Corniche, Doha",
      amenities: ["Wifi", "Petit dejeuner", "Navette aeroport"],
      rating: 4.5,
    },
    program: [
      {
        dayLabel: "Jour 1",
        title: "Arrivee et installation",
        description: "Transfert puis premiere sortie libre sur la Corniche ou dans les quartiers voisins.",
        imageUrl: SKYLINE,
        location: "Corniche",
        meal: "Libre",
      },
      {
        dayLabel: "Jour 2",
        title: "Souq et centre moderne",
        description: "Matinee au souq puis apres-midi libre pour shopping et restauration.",
        imageUrl: CITY_STREET,
        location: "Souq Waqif",
        meal: "Petit dejeuner",
        isLast: true,
      },
    ],
  }),
  buildOffer({
    id: "fallback-paris",
    slug: "paris-lumiere",
    title: "Paris Lumiere",
    destination: "Paris",
    country: "France",
    flag: "🇫🇷",
    region: "Europe",
    shortDescription:
      "Un format parisien classique pour les couples ou les petits groupes qui veulent une base centrale et pratique.",
    mainImageUrl: EIFFEL,
    galleryUrls: [CITY_STREET, SKYLINE, AIRPORT],
    dates: "10 - 14 decembre 2026",
    startDate: "2026-12-10",
    durationDays: 5,
    priceAmount: 189000,
    tag: "City break",
    badge: "Places limitees",
    badgeVariant: "warning",
    status: "almost-full",
    showOnHomepage: false,
    departureLocation: "Depart Alger",
    location: "Montmartre & centre",
    time: "Vol direct + transfert",
    hotel: {
      id: "hotel-montmartre-grand",
      name: "Montmartre Grand Hotel",
      description:
        "Hotel 4 etoiles bien place pour profiter des quartiers vivants de Paris et des grands axes de transport.",
      stars: 4,
      mainImageUrl: SKYLINE,
      galleryUrls: [EIFFEL, CITY_STREET],
      city: "Paris",
      country: "France",
      address: "Montmartre, Paris",
      amenities: ["Petit dejeuner", "Wifi", "Reception 24/7"],
      rating: 4.5,
    },
    program: [
      {
        dayLabel: "Jour 1",
        title: "Installation et premiere balade",
        description: "Installation puis soiree libre pour profiter de l'ambiance parisienne.",
        imageUrl: EIFFEL,
        location: "Montmartre",
        meal: "Libre",
      },
      {
        dayLabel: "Jour 2",
        title: "Paris iconique",
        description: "Journee libre entre quartiers centraux, shopping et grands monuments.",
        imageUrl: CITY_STREET,
        location: "Centre de Paris",
        meal: "Petit dejeuner",
        isLast: true,
      },
    ],
  }),
  buildOffer({
    id: "fallback-bali",
    slug: "bali-tropical-escape",
    title: "Bali Tropical Escape",
    destination: "Bali",
    country: "Indonesie",
    flag: "🇮🇩",
    region: "Asie",
    shortDescription:
      "Un produit balneaire et nature pour les clients qui veulent une offre complete avec hebergement chaleureux.",
    mainImageUrl: TROPICAL,
    galleryUrls: [KAYAK, JUNGLE, BEACH],
    dates: "04 - 11 aout 2026",
    startDate: "2026-08-04",
    durationDays: 8,
    priceAmount: 238000,
    tag: "Lune de miel",
    badge: "Disponible",
    badgeVariant: "info",
    status: "available",
    showOnHomepage: false,
    departureLocation: "Depart Alger",
    location: "Ubud & Canggu",
    time: "Vol avec escale + transferts prives",
    hotel: {
      id: "hotel-ubud-rice",
      name: "Ubud Rice Retreat",
      description:
        "Retraite 4 etoiles dans un cadre vegetal, parfaite pour une clientele detente et immersion.",
      stars: 4,
      mainImageUrl: JUNGLE,
      galleryUrls: [TROPICAL, KAYAK],
      city: "Ubud",
      country: "Indonesie",
      address: "Ubud, Bali",
      amenities: ["Piscine", "Petit dejeuner", "Spa"],
      rating: 4.8,
    },
    program: [
      {
        dayLabel: "Jour 1",
        title: "Arrivee et repos",
        description: "Transfert vers l'hotel puis installation dans un environnement calme et vegetal.",
        imageUrl: TROPICAL,
        location: "Ubud",
        meal: "Libre",
      },
      {
        dayLabel: "Jour 2",
        title: "Detente et decouvertes",
        description: "Journee libre entre balades, restaurants et activites sur place ou a proximite.",
        imageUrl: KAYAK,
        location: "Bali",
        meal: "Petit dejeuner",
        isLast: true,
      },
    ],
  }),
];

export function getFallbackOfferDetails({
  region,
  homepage,
}: {
  region?: string;
  homepage?: boolean;
} = {}) {
  return fallbackOfferDetails.filter((offer) => {
    if (region && region !== "Tout" && offer.region !== region) {
      return false;
    }

    if (homepage && !offer.showOnHomepage) {
      return false;
    }

    return true;
  });
}

export function findFallbackOffer(slugOrId: string) {
  return fallbackOfferDetails.find(
    (offer) => offer.id === slugOrId || offer.slug === slugOrId,
  );
}
