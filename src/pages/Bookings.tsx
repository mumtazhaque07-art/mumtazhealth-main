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
import { ArrowLeft, Calendar, Clock, Users, Check, Filter, X, Heart } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { bookingSchema, validateInput } from "@/lib/validation";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";

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
  const [bookingDate, setBookingDate] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [durationFilter, setDurationFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
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
    setBookingDate('');
    setBookingNotes('');
    setIsDialogOpen(true);
  };

  const confirmBooking = async () => {
    if (!user || !selectedService || !bookingDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate booking input
    const validation = validateInput(bookingSchema, {
      service_id: selectedService.id,
      booking_date: bookingDate,
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
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
      return;
    }

    // Send admin notification email
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', user.id)
        .single();

      await supabase.functions.invoke('send-booking-email', {
        body: {
          type: 'admin_notification',
          bookingId: bookingData?.id,
          userEmail: user.email,
          userName: profileData?.username || user.email?.split('@')[0] || 'User',
          serviceTitle: selectedService.title,
          bookingDate: new Date(bookingDate).toLocaleString(),
          duration: selectedService.duration_days 
            ? `${selectedService.duration_days} days` 
            : `${selectedService.duration_hours} hours`,
          price: `${selectedService.currency} ${selectedService.price}`,
          notes: bookingNotes || undefined,
          adminEmail: 'admin@holistic-wellness.com',
        },
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    toast.success('Booking request submitted! We will confirm shortly.');
    setIsDialogOpen(false);
    loadMyBookings();
  };

  const cancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    // Get booking details for email
    const booking = myBookings.find(b => b.id === bookingId);
    if (!booking) return;

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

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

  return (
    <div className="min-h-screen bg-wellness-beige animate-fade-in">
      <Navigation />
      <div className="max-w-6xl mx-auto p-4 pb-8 pt-24">
        {/* Header */}
        <Card className="mb-6 bg-wellness-warm border-wellness-taupe/20 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/")}
                  className="text-wellness-taupe"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tracker
                </Button>
                <CardTitle className="text-2xl font-bold text-wellness-taupe">
                  Book Services
                </CardTitle>
              </div>
            </div>
            <CardDescription>
              Deep consultations, workshops, retreats, and teacher training programs
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList>
            <TabsTrigger value="services">Book with Mumtaz</TabsTrigger>
            <TabsTrigger value="mybookings">My Requests ({myBookings.length})</TabsTrigger>
          </TabsList>

          {/* Browse Services */}
          <TabsContent value="services" className="space-y-6">
            {/* Simplified Single Consultation Card */}
            <div className="max-w-2xl mx-auto py-8">
              <Card className="overflow-hidden border-wellness-taupe/20 shadow-xl bg-gradient-to-br from-wellness-warm to-white">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000" 
                    alt="Consultation with Mumtaz" 
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wellness-taupe/60 to-transparent flex items-end p-6">
                    <CardTitle className="text-3xl font-bold text-white">
                      Consult with Mumtaz
                    </CardTitle>
                  </div>
                </div>
                <CardHeader>
                  <CardDescription className="text-lg leading-relaxed text-wellness-taupe/90">
                    Experience private, holistic guidance tailored to your unique journey. Mumtaz offers deep consultations for Ayurvedic wellness, hormonal transition support, and personalized lifestyle practices.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-wellness-taupe">
                      <div className="p-2 rounded-full bg-wellness-sage/20">
                        <Heart className="w-5 h-5" />
                      </div>
                      <span>One-to-one personalised Ayurvedic care</span>
                    </div>
                    <div className="flex items-center gap-3 text-wellness-taupe">
                      <div className="p-2 rounded-full bg-wellness-sage/20">
                        <Users className="w-5 h-5" />
                      </div>
                      <span>Tailored for your specific life phase & needs</span>
                    </div>
                    <div className="flex items-center gap-3 text-wellness-taupe">
                      <div className="p-2 rounded-full bg-wellness-sage/20">
                        <Clock className="w-5 h-5" />
                      </div>
                      <span>Flexible session lengths and delivery</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={() => {
                        const generalService = services.find(s => s.category === 'consultation') || services[0];
                        if (generalService) handleBookService(generalService);
                        else toast.error("Booking service currently unavailable. Please check back soon.");
                      }}
                      className="w-full py-6 text-lg bg-wellness-lilac hover:bg-wellness-lilac/90 text-white shadow-lg transition-transform hover:scale-[1.02]"
                    >
                      <Calendar className="w-5 h-5 mr-3" />
                      Request a Consultation
                    </Button>
                    <p className="text-center text-sm text-muted-foreground mt-4 italic">
                      Pricing and package details will be shared during your initial inquiry.
                    </p>
                  </div>
                </CardContent>
              </Card>
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
                              onClick={() => cancelBooking(booking.id)}
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Request Consultation</DialogTitle>
              <DialogDescription>
                Mumtaz will review your request and contact you to confirm the details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="booking-date">Preferred Date *</Label>
                <Input
                  id="booking-date"
                  type="datetime-local"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="mt-2"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div>
                <Label htmlFor="booking-notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="booking-notes"
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Any specific requirements or questions..."
                  className="mt-2"
                  rows={4}
                />
              </div>
                <div className="bg-wellness-lilac/5 p-3 rounded-lg border border-wellness-lilac/10">
                  <p className="text-xs text-wellness-taupe italic">
                    Note: This is a booking request. You will be contacted regarding session availability and fees.
                  </p>
                </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={confirmBooking}
                className="bg-wellness-taupe hover:bg-wellness-taupe/90"
              >
                Confirm Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}