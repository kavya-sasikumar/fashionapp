const boardMap: Record<string, Record<'women' | 'men', string | undefined>> = {
  daily:      { women: process.env.PINTEREST_WOMEN_EVERYDAY, men: process.env.PINTEREST_MEN_EVERYDAY },
  parties:    { women: process.env.PINTEREST_WOMEN_PARTY,    men: process.env.PINTEREST_MEN_PARTY },
  weekend:    { women: process.env.PINTEREST_WOMEN_WEEKEND,  men: process.env.PINTEREST_MEN_WEEKEND },
  concerts:   { women: process.env.PINTEREST_WOMEN_CONCERTS, men: process.env.PINTEREST_MEN_CONCERTS },
  work:       { women: process.env.PINTEREST_WOMEN_WORK,     men: process.env.PINTEREST_MEN_WORK },
  dinners:    { women: process.env.PINTEREST_WOMEN_DINNERS,  men: process.env.PINTEREST_MEN_DINNERS },
  gym:        { women: process.env.PINTEREST_WOMEN_GYM,      men: process.env.PINTEREST_MEN_GYM },  
}

export function getBoardId(event: string, gender: 'women' | 'men') {
  return boardMap[event]?.[gender]
}