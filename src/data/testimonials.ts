// BHAYA INDIA — Testimonials Data

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  review: string;
  initial: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t-01",
    name: "Priya Sharma",
    role: "Regular Customer",
    location: "Mumbai",
    rating: 5,
    review: "Bhaya India has become my go-to for quality products. The textiles are exceptional and the service is always personal and reliable. You can genuinely feel the quality difference.",
    initial: "P",
  },
  {
    id: "t-02",
    name: "Rajesh Mehta",
    role: "Business Owner",
    location: "Ahmedabad",
    rating: 5,
    review: "We have been sourcing our corporate gift hampers from Bhaya India for the past two years. The quality is consistent, the packaging is premium and the team is extremely responsive.",
    initial: "R",
  },
  {
    id: "t-03",
    name: "Ananya Krishnan",
    role: "Interior Designer",
    location: "Bengaluru",
    rating: 5,
    review: "The homeware collection is beautifully curated. Bhaya India understands what quality means — not just in the products but in the entire experience from enquiry to delivery.",
    initial: "A",
  },
];
