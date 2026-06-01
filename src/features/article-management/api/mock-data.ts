import type { Article } from "./types"

export const mockArticles: Article[] = [
  {
    id: 1,
    status: "draft",
    title: "Komodo Boat Trip Guide: What To Expect On A 3D2N Sailing Adventure",
    intro_hook:
      "A Komodo boat trip is one of Indonesia's most unforgettable adventures, combining sunrise hikes, remote islands and life on the water over several days.",
    main_article_body: [
      {
        heading: "What Is A Komodo Boat Trip Like?",
        content:
          "Most Komodo boat trips depart from Labuan Bajo in Flores and run over three days and two nights. Travellers sleep onboard while visiting destinations such as Padar Island, Pink Beach and Komodo Island.",
      },
      {
        heading: "Shared Vs Private Boats",
        content:
          "Shared boats are generally the most budget-friendly option and attract solo travellers or small groups looking for a social atmosphere.",
      },
      {
        heading: "When To Visit Komodo",
        content:
          "The dry season from April to October is usually considered the best time for calmer seas and clearer skies.",
      },
    ],
    best_for:
      "Adventure travellers, nature lovers, backpackers, couples looking for island-hopping experiences",
    not_for:
      "Travellers expecting luxury resort-style comfort, people prone to seasickness",
    ethics_safety_notes:
      "Avoid operators that feed wildlife for tourist photos. Confirm the boat has life jackets and proper safety equipment before departure.",
    key_facts: [
      { label: "Trip Duration", value: "3D2N" },
      { label: "Departure Point", value: "Labuan Bajo" },
      { label: "Typical Price Range", value: "$250-$600 USD" },
      { label: "Best Season", value: "April to October" },
    ],
    original_content:
      "Komodo boat trips usually start from Labuan Bajo. Most operators offer either shared boats or private charters.",
  },
  {
    id: 2,
    status: "reviewed",
    title: "Bali Hidden Temples: Off The Beaten Path",
    intro_hook:
      "Beyond Uluwatu and Tanah Lot lie dozens of ancient temples tucked away in rice fields and jungle valleys.",
    main_article_body: [
      {
        heading: "Why Visit Hidden Temples",
        content:
          "While popular temples draw crowds at sunset, hidden temples offer a peaceful glimpse into Balinese spiritual life without the tourist rush.",
      },
      {
        heading: "Temple Etiquette",
        content:
          "Visitors should wear a sarong and sash, speak quietly, and never climb on sacred structures.",
      },
    ],
    best_for: "Solo travellers, culture enthusiasts, photographers",
    not_for: "Travellers with limited mobility, those wanting nightlife",
    ethics_safety_notes:
      "Always follow local customs and dress codes. Some temples require a local guide.",
    key_facts: [
      { label: "Best Time", value: "Early morning (6-8am)" },
      { label: "Entry Fee", value: "Free - $5 USD" },
      { label: "Required", value: "Sarong and sash" },
    ],
    original_content: "Bali has hundreds of temples...",
  },
  {
    id: 3,
    status: "published",
    title: "Vietnam Street Food: A First-Timer's Guide",
    intro_hook:
      "From Hanoi's pho stalls to Ho Chi Minh City's buzzing night markets, Vietnam's street food scene is a sensory overload in the best way.",
    main_article_body: [
      {
        heading: "Must-Try Dishes",
        content:
          "Pho, banh mi, bun cha, and cao lau are essential. Each region has its own specialty.",
      },
      {
        heading: "Street Food Safety",
        content:
          "Eat where locals eat - high turnover means fresh ingredients. Avoid raw vegetables if you have a sensitive stomach.",
      },
    ],
    best_for: "Food lovers, budget travellers, adventurous eaters",
    not_for:
      "Anyone with strict dietary restrictions, hygiene-sensitive travellers",
    ethics_safety_notes:
      "Carry hand sanitiser. Drink bottled or filtered water only.",
    key_facts: [
      { label: "Average Meal Cost", value: "$1-$3 USD" },
      { label: "Best Cities", value: "Hanoi, Hoi An, Ho Chi Minh City" },
    ],
    original_content: "Vietnamese street food is world-famous...",
  },
]
