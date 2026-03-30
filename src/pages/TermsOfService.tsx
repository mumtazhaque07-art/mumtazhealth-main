import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 pt-24">
      <Navigation />
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="border-none shadow-lg">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-12 h-12 bg-wellness-sage/20 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-wellness-sage" />
            </div>
            <CardTitle className="text-3xl font-bold font-accent text-mumtaz-plum">Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Last Updated: March 2024</p>
          </CardHeader>
          <CardContent className="prose prose-sm sm:prose-base max-w-none text-muted-foreground space-y-6 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h3>
              <p>
                By using Mumtaz Health, you agree to comply with and be bound by these terms. If you do not agree, please do not use the service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">2. Medical Disclaimer</h3>
              <p className="font-bold text-foreground">
                Mumtaz Health is an educational and wellness tool. It does not provide medical advice.
              </p>
              <p>
                Always consult with a qualified healthcare professional before starting new health protocols, especially during pregnancy or recovery.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">3. User Conduct</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">4. Use of Content</h3>
              <p>
                The protocols, daily practices, and educational content are for your personal, non-commercial use only.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">5. Termination</h3>
              <p>
                We reserve the right to terminate or suspend access to our service immediately, without prior notice, for conduct that we believe violates these terms.
              </p>
            </section>

            <div className="pt-8 border-t border-border mt-8 text-center text-xs italic">
              Questions? Contact us at mumtazhaque07@gmail.com
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
