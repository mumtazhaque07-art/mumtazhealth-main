import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, Users, Check, Filter, X, Heart } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Navigation } from "@/components/Navigation";
import { bookingSchema, validateInput } from "@/lib/validation";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { mumtazYoga8 } from "@/assets/brandImages";
import { PaymentModal } from "@/components/PaymentModal";

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  duration_days: number | null;
  duration_hours: number | null;
  price: number;
  currency: string;
  max_capacity: number | null;
  upcoming_dates?: UpcomingDate[];
}

interface UpcomingDate {
  date: string;
  capacity: number;
  booked: number;
}

interface Booking {
  id: string;
  service_id: string;
  booking_date: string;
  status: string;
  notes: string | null;
  created_at: string;
  services: Service;
}

export default function Bookings() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDate, setBookingDate] = useState<Date | undefined>(undefined);
  const [bookingTime, setBookingTime] = useState<string>('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [durationFilter, setDurationFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadServices();
      loadMyBookings();
    }
  }, [user]);

  const loadServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true });
    
    if (error) {
      console.error('Error loading services:', error);
      toast.error('Failed to load services');
      return;
    }
    
    setServices(data || []);
  };

  const loadMyBookings = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*, services(*)')
      .eq('user_id', user.id)
      .order('booking_date', { ascending: false });
    
    if (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load your bookings');
      return;
    }
    
    setMyBookings(data || []);
  };

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setBookingDate(undefined);
    setBookingTime('');
    setBookingNotes('');
    setIsDialogOpen(true);
  };

  const executeBooking = async () => {
    if (!user || !selectedService) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    let finalBookingDate = "";
    let finalStatus = "pending";

    if (selectedService.category === 'workshop') {
      const hasDates = selectedService.upcoming_dates && selectedService.upcoming_dates.length > 0;
      if (hasDates) {
        if (!bookingDate) {
          toast.error('Please select a workshop date.');
          return;
        }
        finalBookingDate = bookingDate.toISOString();
      } else {
        // Waitlist
        finalBookingDate = new Date(Date.now() + 86400000).toISOString(); // Future mock date for validation
        finalStatus = 'waitlisted';
      }
    } else {
      if (!bookingDate || !bookingTime) {
        toast.error('Please select a preferred date and time for your session.');
        return;
      }
      const [hours, minutes] = bookingTime.split(':');
      const dateObj = new Date(bookingDate);
      dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      finalBookingDate = dateObj.toISOString();
    }
    
    // Make sure we have validated data to insert
    const validation = validateInput(bookingSchema, {
      service_id: selectedService.id,
      booking_date: finalBookingDate,
      notes: bookingNotes || null,
    });
    
    if (!validation.success) {
      toast.error((validation as { success: false; error: string }).error);
      return;
    }
    
    const validatedData = validation.data;

    const { data: bookingData, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        service_id: validatedData.service_id,
        booking_date: new Date(validatedData.booking_date).toISOString(),
        notes: validatedData.notes,
        status: finalStatus,
      })
      .select()
      .single();

    // Send email notification to Mumtaz
    if (user) {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username')
          .eq('user_id', user.id)
          .single();

        await supabase.functions.invoke('send-booking-email', {
          body: {
            type: finalStatus === 'waitlisted' ? 'waitlist' : 'created',
            bookingId: bookingData.id,
            userEmail: user.email,
            userName: profileData?.username || user.email?.split('@')[0] || 'User',
            serviceTitle: selectedService.title,
            bookingDate: finalStatus === 'waitlisted' ? 'Waitlist' : new Date(finalBookingDate).toLocaleString(),
            notes: validatedData.notes || 'No notes provided.',
          },
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }
    }

    if (finalStatus === 'waitlisted') {
      toast.success('You have been added to the waitlist. You will be notified when dates open up!');
    } else {
      toast.success('Your healing space is requested. You will receive a Google Calendar invite shortly.');
    }
    setIsDialogOpen(false);
    loadMyBookings();
  };

  const executeCancelBooking = async () => {
    if (!bookingToCancel) return;

    // Get booking details for email
    const booking = myBookings.find(b => b.id === bookingToCancel);
    if (!booking) return;

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingToCancel);

    if (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
      return;
    }

    // Send cancellation email
    if (user) {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username')
          .eq('user_id', user.id)
          .single();

        await supabase.functions.invoke('send-booking-email', {
          body: {
            type: 'cancelled',
            bookingId: booking.id,
            userEmail: user.email,
            userName: profileData?.username || user.email?.split('@')[0] || 'User',
            serviceTitle: booking.services.title,
            bookingDate: new Date(booking.booking_date).toLocaleString(),
          },
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }
    }

    toast.success('Booking cancelled');
    setBookingToCancel(null);
    loadMyBookings();
  };

  const getServicesByCategory = (category: string) => {
    return services.filter(s => s.category === category);
  };

  const getFilteredServices = () => {
    return services.filter(service => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(service.category)) {
        return false;
      }
      
      // Price filter (convert to GBP if needed)
      const servicePrice = service.currency === 'GBP' ? service.price : service.price;
      if (servicePrice < priceRange[0] || servicePrice > priceRange[1]) {
        return false;
      }
      
      // Duration filter
      if (durationFilter !== 'all') {
        if (durationFilter === 'short' && service.duration_hours && service.duration_hours > 4) {
          return false;
        }
        if (durationFilter === 'medium' && (!service.duration_hours || service.duration_hours <= 4) && (!service.duration_days || service.duration_days > 7)) {
          return false;
        }
        if (durationFilter === 'long' && (!service.duration_days || service.duration_days <= 7)) {
          return false;
        }
      }
      
      return true;
    });
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
    setDurationFilter('all');
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
    priceRange[0] !== 0 || priceRange[1] !== 5000 || 
    durationFilter !== 'all';

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      consultation: 'Consultations',
      workshop: 'Workshops',
      retreat: 'Retreats',
      training: 'Teacher Training',
    };
    return labels[category] || category;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDualCurrency = (priceGBP: number) => {
    const priceSAR = priceGBP * 4.7;
    return {
      gbp: `£${priceGBP.toFixed(2)}`,
      sar: `${priceSAR.toFixed(2)} SAR`
    };
  };

  // Integrate with global loading indicator
  useGlobalLoading(loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-wellness-lavender/20 to-background animate-fade-in">
        <Navigation />
        <div className="max-w-6xl mx-auto p-4 pt-24 space-y-6">
          {/* Header skeleton */}
          <Card className="bg-wellness-warm border-wellness-taupe/20">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                <div className="h-8 w-48 bg-muted animate-pulse rounded" />
              </div>
            </CardHeader>
          </Card>
          
          {/* Services grid skeleton */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border-wellness-sage/20">
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-10 w-20 bg-muted animate-pulse rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const consultationService = services.find(s => s.category === 'consultation');
  const workshopService = services.find(s => s.category === 'workshop');

  return (
    <div className="min-h-screen bg-wellness-beige animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Navigation />
      <div className="max-w-6xl mx-auto p-4 pb-8 pt-24">
        {/* Header - Improved with image and better welcoming */}
        <Card className="mb-8 overflow-hidden border-none shadow-2xl bg-gradient-to-br from-wellness-taupe/10 to-background/50">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 h-64 md:h-auto overflow-hidden relative">
              <img 
                src={mumtazYoga8} 
                alt="Mumtaz Haque" 
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card/50 md:to-card hidden md:block"></div>
            </div>
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center bg-card/60 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-wellness-lilac text-white border-none px-4 py-1">Direct Guidance</Badge>
                <div className="h-1 w-12 bg-wellness-sage/30 rounded-full"></div>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
                Consult with Mumtaz
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
                "My mission is to hold space for your healing. Through a holistic and Ayurvedic approach—integrating therapeutic yoga and transformational inner child healing—we reclaim your vitality together."
              </p>
              <div className="mt-8 flex items-center gap-4">
                 <Button
                    onClick={() => handleBookService(services.find(s => s.category === 'consultation') || services[0] || { 
                      id: 'temp-1', 
                      title: '1-to-1 Consultation', 
                      description: 'Private assessment', 
                      category: 'consultation', 
                      duration_days: null, 
                      duration_hours: 1, 
                      price: 0, 
                      currency: 'GBP', 
                      max_capacity: 1 
                    })}
                    className="rounded-full bg-wellness-sage hover:bg-wellness-sage/90 text-white shadow-lg shadow-wellness-sage/20 transition-all active:scale-[0.98] font-semibold px-6 py-5 text-md"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Consultation
                  </Button>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList>
            <TabsTrigger value="services">Book with Mumtaz</TabsTrigger>
            <TabsTrigger value="mybookings">My Requests ({myBookings.length})</TabsTrigger>
          </TabsList>

          {/* Browse Services */}
          <TabsContent value="services" className="space-y-6">
            {services.length === 0 ? (
              <div className="max-w-4xl mx-auto py-16">
                <Card className="overflow-hidden border-white/40 shadow-xl bg-white/40 backdrop-blur-xl group rounded-[2.5rem] p-12 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-wellness-sage/10 flex items-center justify-center mb-6 shadow-inner">
                    <Calendar className="w-10 h-10 text-wellness-sage" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-wellness-taupe mb-4 tracking-tight">Booking Soon</CardTitle>
                  <CardDescription className="text-lg leading-relaxed text-wellness-taupe/80 max-w-md mx-auto">
                    Mumtaz is currently preparing her calendar for new consultations and workshops. Please check back soon for available slots.
                  </CardDescription>
                </Card>
              </div>
            ) : (
            <>
              <div className="max-w-4xl mx-auto py-8">
                <div className="grid md:grid-cols-2 gap-8">
                <Card className="overflow-hidden border-border/40 shadow-xl bg-card/60 backdrop-blur-xl hover:bg-card/80 glow-card-accent transition-all duration-500 group rounded-[2.5rem]">
                   <div className="p-8">
                    <div className="w-16 h-16 rounded-[2rem] bg-accent/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                      <Heart className="w-8 h-8 text-accent" />
                    </div>
                    <div className="flex flex-col mb-8">
                      <CardTitle className="text-3xl font-bold text-foreground mb-2 tracking-tight">1-to-1 Consultation</CardTitle>
                      {consultationService ? (
                        <div className="inline-flex items-center text-wellness-taupe/70 font-medium text-base mb-2">
                          <span className="opacity-70 mr-1">Exchange:</span>
                          {consultationService.currency === 'GBP' ? '£' : ''}{consultationService.price.toFixed(0)}
                          <span className="text-xs font-normal text-wellness-taupe/50 ml-1">
                            / {consultationService.duration_hours ? `${consultationService.duration_hours} hr` : 'session'}
                          </span>
                        </div>
                      ) : (
                        <CardDescription className="text-wellness-taupe/50 font-medium italic mb-2">Exchange Details Unavailable</CardDescription>
                      )}
                    </div>
                    <CardDescription className="text-lg leading-relaxed text-wellness-taupe/80 mb-8">
                      Deep Ayurvedic assessment, pulse constitutional analysis, and a personalized path for your current life phase.
                    </CardDescription>
                    <ul className="space-y-4 mb-10">
                      <li className="flex items-center gap-3 text-wellness-taupe/70 font-medium">
                        <div className="p-1 rounded-full bg-wellness-sage/20 text-wellness-sage"><Check className="w-4 h-4" /></div> Individual constitutional analysis
                      </li>
                      <li className="flex items-center gap-3 text-wellness-taupe/70 font-medium">
                        <div className="p-1 rounded-full bg-wellness-sage/20 text-wellness-sage"><Check className="w-4 h-4" /></div> Custom nutrition & lifestyle plan
                      </li>
                      <li className="flex items-center gap-3 text-wellness-taupe/70 font-medium">
                        <div className="p-1 rounded-full bg-wellness-sage/20 text-wellness-sage"><Check className="w-4 h-4" /></div> Spiritual alignment guidance
                      </li>
                    </ul>
                    <Button 
                      onClick={() => handleBookService(services.find(s => s.category === 'consultation') || services[0] || { 
                        id: 'temp-1', 
                        title: '1-to-1 Consultation', 
                        description: 'Private assessment', 
                        category: 'consultation', 
                        duration_days: null, 
                        duration_hours: 1, 
                        price: 0, 
                        currency: 'GBP', 
                        max_capacity: 1 
                      })}
                      className="w-full bg-accent hover:bg-accent/90 text-white rounded-2xl h-14 text-lg font-bold shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Request Your Session
                    </Button>
                  </div>
                </Card>

                <Card className="overflow-hidden border-border/10 shadow-xl bg-card hover:bg-muted/30 hover:shadow-2xl transition-all group">
                   <div className="p-6">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="flex flex-col mb-6">
                      <CardTitle className="text-2xl font-bold text-foreground mb-2">Workshops & Group</CardTitle>
                      {workshopService ? (
                        <div className="inline-flex items-center text-wellness-taupe/70 font-medium text-base mb-2">
                          <span className="opacity-70 mr-1">Exchange:</span>
                          {workshopService.currency === 'GBP' ? '£' : ''}{workshopService.price.toFixed(0)}
                          <span className="text-xs font-normal text-wellness-taupe/50 ml-1">
                            / {workshopService.duration_hours ? `${workshopService.duration_hours} hr` : 'session'}
                          </span>
                        </div>
                      ) : (
                        <CardDescription className="text-wellness-taupe/50 font-medium italic mb-2">Exchange Details Unavailable</CardDescription>
                      )}
                    </div>
                    <CardDescription className="text-base leading-relaxed text-wellness-taupe/80 mb-6">
                      Join a community of women in themed workshops covering Menarche, Menopause, and Postpartum wisdom.
                    </CardDescription>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-2 text-sm text-wellness-taupe/70">
                        <Check className="w-4 h-4 text-wellness-sage" /> Live group coaching & Q&A
                      </li>
                      <li className="flex items-center gap-2 text-sm text-wellness-taupe/70">
                        <Check className="w-4 h-4 text-wellness-sage" /> Themed seasonal practices
                      </li>
                      <li className="flex items-center gap-2 text-sm text-wellness-taupe/70">
                        <Check className="w-4 h-4 text-wellness-sage" /> Peer support & shared learning
                      </li>
                    </ul>
                    <Button 
                      onClick={() => handleBookService(services.find(s => s.category === 'workshop') || { 
                        id: 'temp-2', 
                        title: 'Wisdom Workshop', 
                        description: 'Group session', 
                        category: 'workshop', 
                        duration_days: null, 
                        duration_hours: 2, 
                        price: 0, 
                        currency: 'GBP', 
                        max_capacity: 20 
                      })}
                      variant="outline"
                      className="w-full border-wellness-taupe/20 text-wellness-taupe hover:bg-wellness-warm rounded-xl"
                    >
                      View Schedule
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
            
            {/* No results message */}
            {getFilteredServices().length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">No services match your current filters</p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
            </>
            )}
          </TabsContent>

          {/* My Bookings */}
          <TabsContent value="mybookings">
            {myBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">You haven't made any bookings yet</p>
                  <Button onClick={() => document.querySelector<HTMLButtonElement>('[value="services"]')?.click()}>
                    Browse Services
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myBookings.map(booking => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{booking.services.title}</CardTitle>
                          <CardDescription>
                            {new Date(booking.booking_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          {booking.services.description}
                        </p>
                        {booking.notes && (
                          <div className="bg-muted p-3 rounded-md">
                            <p className="text-sm"><strong>Your notes:</strong> {booking.notes}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          {booking.status === 'confirmed' && (
                            <Badge className="bg-green-100 text-green-800">
                              <Check className="w-3 h-3 mr-1" />
                              Confirmed
                            </Badge>
                          )}
                          {booking.status === 'pending' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setBookingToCancel(booking.id)}
                            >
                              Cancel Booking
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Booking Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md rounded-3xl overflow-hidden p-0 border-0 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-br from-wellness-sage to-wellness-sage/90 text-white p-8 pb-10">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white mb-2">Reserve Your Space</DialogTitle>
                <DialogDescription className="text-white/80 text-base">
                  Choose a sanctuary time that honors your daily rhythm.
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="space-y-4 p-8 -mt-6 bg-card rounded-t-3xl relative z-10 overflow-y-auto flex-1">
              <div className="bg-muted p-4 rounded-xl border border-border mb-2">
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedService?.category === 'workshop' 
                    ? (!selectedService.upcoming_dates || selectedService.upcoming_dates.length === 0 
                        ? "Currently, no dates are available. Join the waitlist and Mumtaz will notify you when new sessions open."
                        : "Select an upcoming workshop date.")
                    : "Select your preferred date and time below. Mumtaz will review your request and send a direct Google Calendar Invitation."
                  }
                </p>
              </div>
              
              {selectedService?.category !== 'workshop' ? (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <Label className="text-foreground text-sm font-semibold mb-3 block">Select Date</Label>
                    <div className="border border-border rounded-2xl bg-card text-card-foreground flex justify-center p-2 shadow-sm">
                      <CalendarUI
                        mode="single"
                        selected={bookingDate}
                        onSelect={setBookingDate}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        className="rounded-xl border-none shadow-none text-card-foreground"
                      />
                    </div>
                  </div>
                  
                  {bookingDate && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                      <Label className="text-foreground text-sm font-semibold mb-3 block">Select Time (UK Time)</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {['09:00', '10:30', '13:00', '14:30', '16:00', '18:00'].map((time) => (
                          <button
                            key={time}
                            onClick={() => setBookingTime(time)}
                            className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                              bookingTime === time 
                                ? 'bg-wellness-sage border-wellness-sage text-white shadow-md' 
                                : 'bg-background hover:bg-muted border-border'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedService.upcoming_dates && selectedService.upcoming_dates.length > 0 ? (
                    <>
                      <Label className="text-foreground text-sm font-semibold block mb-2">Available Sessions</Label>
                      {selectedService.upcoming_dates.map((session, idx) => {
                        const sessionDate = new Date(session.date);
                        const isSelected = bookingDate && bookingDate.getTime() === sessionDate.getTime();
                        return (
                          <div 
                            key={idx} 
                            onClick={() => setBookingDate(sessionDate)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                              isSelected ? 'border-wellness-sage bg-wellness-sage/5 ring-2 ring-wellness-sage/20' : 'hover:border-wellness-taupe/40'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${isSelected ? 'bg-wellness-sage text-white' : 'bg-muted text-muted-foreground'}`}>
                                <Calendar className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{format(sessionDate, 'EEEE, MMMM do, yyyy')}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {format(sessionDate, 'h:mm a')}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={session.capacity - session.booked > 0 ? "outline" : "secondary"}>
                                {session.capacity - session.booked > 0 ? `${session.capacity - session.booked} spots left` : 'Full'}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="py-6 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl bg-muted/30">
                      <div className="w-12 h-12 rounded-full bg-wellness-sage/10 flex items-center justify-center mb-3">
                        <Users className="w-6 h-6 text-wellness-sage" />
                      </div>
                      <h4 className="font-semibold text-foreground">Next Cohort Forming</h4>
                      <p className="text-sm text-muted-foreground max-w-[250px] mt-1">Join the waitlist to get priority access when new dates are announced.</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4">
                <Label htmlFor="booking-notes" className="text-foreground text-sm font-semibold mb-2 block">
                  {selectedService?.category === 'workshop' && (!selectedService.upcoming_dates || selectedService.upcoming_dates.length === 0) 
                    ? "Why do you want to join this workshop?" 
                    : "How can I support you today?"}
                </Label>
                <Textarea
                  id="booking-notes"
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Share a little about what you are going through..."
                  className="mt-2 rounded-xl resize-none"
                  rows={3}
                />
              </div>

            {/* Sticky footer for buttons to ensure they are never cut off on mobile */}
            <div className="p-6 bg-card border-t border-border mt-auto shrink-0 relative z-20">
              <Button 
                onClick={executeBooking}
                className="w-full bg-wellness-sage hover:bg-wellness-sage/90 text-white h-12 rounded-xl shadow-lg shadow-wellness-sage/20 transition-all font-semibold"
              >
                {selectedService?.category === 'workshop' && (!selectedService.upcoming_dates || selectedService.upcoming_dates.length === 0)
                  ? "Join Waitlist"
                  : "Send Request"}
              </Button>
              
              <div className="pt-3">
                 <p className="text-xs text-center text-wellness-taupe/50">
                   You are not charged yet. Fees are discussed after schedule confirmation.
                 </p>
              </div>
            </div>
          </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!bookingToCancel} onOpenChange={(open) => !open && setBookingToCancel(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this booking? This action cannot be undone and your spot will be released.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Booking</AlertDialogCancel>
              <AlertDialogAction onClick={executeCancelBooking} className="bg-red-500 hover:bg-red-600">Cancel Booking</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}