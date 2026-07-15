import React from 'react';
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Heart, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserInbox } from "@/components/UserInbox";

// You can easily add or edit your Google Reviews right here!
const GOOGLE_REVIEWS = [
  {
    id: 1,
    name: "Benjamin Crowley",
    date: "48 weeks ago",
    rating: 5,
    text: "I honestly can't recommend Mumtaz enough. I first attended one of her sessions five years ago when she introduced me to Nidra Yoga, and it had such a powerful impact on me. It helped me slow down, reset, and gave me the calm I didn't even realise I needed... She brings something truly special to her yoga – it's not just movement, it's care, connection, and healing. Thank you, Mumtaz!",
    source: "Google Reviews"
  },
  {
    id: 2,
    name: "Kate Smith",
    date: "2 Oct 2023",
    rating: 5,
    text: "I completed the yoga teacher training with Mumtaz last year. I have now embarked on the 300hour continued advanced learning with Mumtaz because she is so knowledgeable, so passionate and as a teacher, she really shares that with you. No stone is left unturned, you really do explore the meaning of yoga in true depth. And also with love.",
    source: "Google Reviews"
  },
  {
    id: 3,
    name: "Aneela Asim",
    date: "2 Oct 2023",
    rating: 5,
    text: "Mumtaz has been a life saver for me with her healing hands and the ultimate experience of care from her one to one session to the group yoga classes 5 star review doesn't do her justice.",
    source: "Google Reviews"
  },
  {
    id: 4,
    name: "Shoana Qureshi-khan",
    date: "11 Oct 2024",
    rating: 5,
    text: "Mumtaz Yoga spent a rejuvenating morning with therapists and staff at Nottingham Counselling Services, focusing on self-care in the field of giving. The session was invigorating, healing, and wonderfully supportive, offering much-needed relaxation. We can't wait to have you back again for another inspiring experience!",
    source: "Google Reviews"
  },
  {
    id: 5,
    name: "Austin Mepham",
    date: "22 weeks ago",
    rating: 5,
    text: "Mumtaz selflessly shared the abundance of her knowledge, experience and love for yoga in a form of Power yoga module, yesterday and today, with an attention to detail and fun that can rarely be matched. We had fun and learned a lot, as we were deeply immersed in a 2 day programme, equipped to take our new knowledge and experience to our own students! Big thank you to Mumtaz and her family.",
    source: "Google Reviews"
  },
  {
    id: 6,
    name: "Roshni",
    date: "8 weeks ago",
    rating: 5,
    text: "I wanted to complete my yoga teacher training for years but never found the right fit. Until I found Mumtaz. From the very beginning, there was a balance of in-depth learning alongside supportive and welcoming environment. What stood out most was the sense of community and authenticity throughout the training. It wasn't just about gaining a certificate; it was about personal growth, connection, and transformation.",
    source: "Google Reviews"
  },
  {
    id: 7,
    name: "Christina Ihenacho",
    date: "7 weeks ago",
    rating: 5,
    text: "The past year has been the most rewarding learning experience with Mumtaz. Learning from her years of knowledge has been a privilege. I couldn't have asked for a better teacher or a more perfect course. The pace of the course and the topic of each module has kept me curious and excited for the next session. I'm going to miss weekends of giggling, yoga, yummy food and learning with my fellow yogis.",
    source: "Google Reviews"
  },
  {
    id: 8,
    name: "Aggie",
    date: "6 weeks ago",
    rating: 5,
    text: "I don't think any words can do justice to yoga classes, workshops and trainings run by Mumtaz. She's a real specialist in what she does, from explaining anatomy of different postures, through going into deeper knowledge/science of asanas and connecting them to particular needs and emotions. Classes are beautifully designed making yogis feeling grounded calmier and happier during and after sessions.",
    source: "Google Reviews"
  },
  {
    id: 9,
    name: "Eleanor Rowley",
    date: "4 weeks ago",
    rating: 5,
    text: "I absolutely loved Mumtaz's inversion workshop. Her approach made inversions feel accessible, regardless of experience level, while also helping us build the strength, confidence, and technique needed to progress safely. What stood out most was her personalised teaching style. Mumtaz took the time to work with each individual, meeting us where we were and offering guidance that felt supportive.",
    source: "Google Reviews"
  },
  {
    id: 10,
    name: "Tamsin Johnson",
    date: "26 Sept 2023",
    rating: 5,
    text: "Mumtaz's yoga offerings are truly unique, as is she! I completed my 200hr training with her and it was one of best decisions I've ever made - it really did transform my life. Mumtaz's teachings are a beautiful journey of self discovery - she exudes love, knowledge and strength. I cannot recommend her highly enough! Xxx",
    source: "Google Reviews"
  },
  {
    id: 11,
    name: "Debbie Dunlop",
    date: "26 Sept 2023",
    rating: 5,
    text: "As a late bloomer yogi, I started a couple of years ago at Mumtaz's yoga classes. Debbie you are so inspirational.. I love your energy and commitment no matter what challenges you face you always make the effort to show up. It's an absolute honour to have students like you .. Yoga is for everyone no matter what your background.",
    source: "Google Reviews"
  },
  {
    id: 12,
    name: "Malgorzata Szczygiel",
    date: "19 Mar 2024",
    rating: 5,
    text: "I start my YTT with Mumtaz Yoga January 2024. Just gone 2 month and I'm able to teach 1:1 at my home. Don't know what she did to me but massive thank you to this amazing women. She is the best yoga teacher that I could dream for 😍",
    source: "Google Reviews"
  },
  {
    id: 13,
    name: "L Caroline",
    date: "15 Nov 2023",
    rating: 5,
    text: "Fabulous so relaxing and informative can definitely recommend for the yoga journey. Thank you Mumtaz x",
    source: "Google Reviews"
  },
  {
    id: 14,
    name: "Seyna Drame",
    date: "29 Apr 2024",
    rating: 5,
    text: "Just finished the yoga power module with Mumtaz and as one of her graduate, I has a great week-end, it was fun and increased my knowledge. Mumtaz is a great mentor and I strongly recommend her school of yoga <3",
    source: "Google Reviews"
  },
  {
    id: 15,
    name: "Sophie",
    date: "14 May 2024",
    rating: 5,
    text: "Had such a fantastic experience doing Mumtaz's hands-on adjustment module. After doing my 200 YTT with Mumtaz, she was always going to be the place first I looked to for extra modules to top up my knowledge. I came away from the training feeling so confident with the subject matter and I now know how to adjust safely and with intent. Highly recommend Mumtaz for all your yoga training needs.",
    source: "Google Reviews"
  },
  {
    id: 16,
    name: "Be YOU Wellbeing Energy Sound Mind",
    date: "14 Jun 2024",
    rating: 5,
    text: "Doing my yoga teacher training has always been something I wanted to do but I didn't just want to do it with anyone for the sake of a certificate, I wanted an experience, self discovery & a life changing journey! So after searching & feeling like it was never going to happen for me, I crossed paths with Mumtaz & my dreams have come true! Everything I wanted my YTT to be is with Mumtaz plus much, much MORE! The way she teaches is incredible, you are learning SO much yet it's an absolute pleasure not a chore & her authenticity, love & ethos in everything she delivers is unreal! I'll be forever grateful for having this experience & journey because of you! If you're thinking of embarking on this magical yoga journey then I wouldn't go anywhere else!!!",
    source: "Google Reviews"
  }
];

const SisterhoodSanctuary = () => {
  return (
    <div className="min-h-screen bg-wellness-sand/30 pb-20">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex bg-white p-4 rounded-full mb-6 shadow-sm border border-wellness-sage/20">
            <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
            Success Stories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Real experiences from women who have transformed their cycles, fertility, and menopausal journeys with Mumtaz Health.
          </p>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="inbox" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-white/50 backdrop-blur-sm p-1 rounded-full border border-wellness-sage/20 shadow-sm">
              <TabsTrigger value="inbox" className="rounded-full px-8 py-3 data-[state=active]:bg-wellness-sage data-[state=active]:text-white transition-all text-base font-medium flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Direct Coaching
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-full px-8 py-3 data-[state=active]:bg-wellness-sage data-[state=active]:text-white transition-all text-base font-medium flex items-center gap-2">
                <Star className="w-4 h-4" /> Success Stories
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="inbox" className="mt-0 animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif text-gray-900 mb-4">Your Private Coaching Space</h2>
                <p className="text-gray-600 max-w-xl mx-auto">A secure, direct line to Mumtaz for personalized guidance and check-ins along your healing journey.</p>
              </div>
              <UserInbox />
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-0 animate-in fade-in duration-500">
            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {GOOGLE_REVIEWS.map((review) => (
                <Card key={review.id} className="border-none shadow-md hover:shadow-lg transition-shadow bg-white overflow-hidden relative group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-wellness-sage opacity-50" />
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col">
                        <span className="font-serif text-xl text-gray-900 font-bold">{review.name}</span>
                        <span className="text-sm text-gray-500 mt-1">{review.date}</span>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Quote className="absolute -top-3 -left-3 w-8 h-8 text-wellness-sage/20 rotate-180" />
                      <p className="text-gray-700 leading-relaxed relative z-10 pl-6 italic">
                        "{review.text}"
                      </p>
                    </div>
                    
                    <div className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      <Heart className="w-3 h-3 text-wellness-plum" />
                      Verified Google Review
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Footer CTA */}
            <div className="mt-20 text-center bg-white p-10 rounded-3xl shadow-sm border border-wellness-sage/10">
              <h3 className="text-2xl font-serif text-gray-900 mb-4">Ready to start your own healing journey?</h3>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto">Join hundreds of women discovering holistic relief and empowerment.</p>
              <a href="/pricing" className="inline-block bg-wellness-plum hover:bg-wellness-plum/90 text-white rounded-full px-8 py-4 font-medium transition-transform hover:scale-105">
                View Membership Plans
              </a>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default SisterhoodSanctuary;
