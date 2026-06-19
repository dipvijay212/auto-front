export const getDemoPlan = (inputTopic) => {
  const topicText = inputTopic || "Why Every Business Needs a Website";
  return {
    industry: "Digital Marketing / Business Tech",
    audience: "Local business owners, traditional entrepreneurs, and brick-and-mortar store operators.",
    goal: "Educate business owners on the direct ROI of having an online presence, driving leads for website services.",
    painPoints: [
      "Losing local customers to competitors with websites",
      "High cost of traditional advertising with low tracking",
      "Lack of technical expertise to build or maintain a website"
    ],
    benefits: [
      "24/7 visibility and credibility for local search queries",
      "Automated lead capture and customer inquiry management",
      "Cost-effective marketing compared to print/outdoor media"
    ],
    contentType: "Carousel (Educational multi-step guide)",
    visualConcepts: [
      "Slide 1: A traditional storefront next to a search engine mock screen.",
      "Slide 2: A comparison chart of traditional ad costs vs hosting fees.",
      "Slide 3: Visual checklist showing elements of a high-converting site.",
      "Slide 4: Testimonial layout highlighting 300% sales increase.",
      "Slide 5: Clear arrow highlighting a smartphone mock with a Call to Action."
    ]
  };
};

export const getDemoScenes = () => {
  return {
    scenes: [
      "Business owner checking website analytics on a dual-monitor setup, looking satisfied with a positive graph.",
      "Customer happily browsing a clean, modern company website on their smartphone during a coffee break.",
      "An online booking system calendar showing a slot being selected, loading animation, and a 'Booking Confirmed' checkmark appearing.",
      "A business growth dashboard with neon-accented bars and pie charts showing upward conversions.",
      "A user filling out a simple contact form on a laptop screen, sending, and a 'Thank you, we will reach out!' message popping up."
    ]
  };
};

export const getDemoCaption = () => {
  return {
    hook: "Is your business virtually invisible to local customers? 🛑",
    caption: "If you don't have a website in 2026, you're handing sales over to competitors on a silver platter. \n\nConsumers search online before making buying decisions. A website acts as your digital storefront that never closes, answering questions and building trust while you sleep. You don't need a massive budget to start, just a clean landing page showing who you are and what you do.",
    cta: "Comment SITE below and I'll send you my free 5-step blueprint to build your first site in under a weekend! 🚀",
    hashtags: [
      "webdesign", "businessgrowth", "digitalmarketing", "entrepreneurship", 
      "websitebuilder", "localbusiness", "marketingstrategy", "smallbiztips", 
      "onlinemarketing", "seo", "webdevelopment", "brandcredibility", 
      "leadgeneration", "solopreneur", "businessowner", "webpresence", 
      "startups", "techhacks", "nocodewebsites", "growthmindset"
    ]
  };
};

export const DEMO_VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-developer-working-on-his-computer-32982-large.mp4";

export const INITIAL_DEMO_AUTOMATION = {
  enabled: true,
  schedule: ["9 AM", "2 PM", "7 PM"],
  logs: [
    { id: 1, timestamp: '2026-06-17 09:02:14 AM', level: 'SUCCESS', message: 'Reel posted successfully. Media ID: 1802938491028' },
    { id: 2, timestamp: '2026-06-17 09:01:45 AM', level: 'INFO', message: 'FFmpeg compilation finished. Output file: generated/videos/reel_1718600502.mp4' },
    { id: 3, timestamp: '2026-06-17 09:00:30 AM', level: 'INFO', message: 'Piper speech synthesis completed. Voice file saved.' },
    { id: 4, timestamp: '2026-06-17 09:00:02 AM', level: 'INFO', message: 'Triggering scheduled execution pipeline for topic: "10 Life-Changing Shortcuts in VS Code"' },
    { id: 5, timestamp: '2026-06-16 07:01:50 PM', level: 'SUCCESS', message: 'Reel posted successfully. Media ID: 1802938112351' },
    { id: 6, timestamp: '2026-06-16 07:00:01 PM', level: 'INFO', message: 'Triggering scheduled execution pipeline for topic: "5 tips to write better functions"' }
  ]
};
