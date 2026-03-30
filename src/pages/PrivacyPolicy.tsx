import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
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
            <div className="mx-auto w-12 h-12 bg-wellness-lilac/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-wellness-lilac" />
            </div>
            <CardTitle className="text-3xl font-bold font-accent text-mumtaz-plum">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Last Updated: March 2024</p>
          </CardHeader>
          <CardContent className="prose prose-sm sm:prose-base max-w-none text-muted-foreground space-y-6 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold text-foreground">1. Introduction</h3>
              <p>
                At Mumtaz Health, we take your privacy seriously. This policy describes how we collect, use, and protect your personal wellness and lifecycle data.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">2. Data We Collect</h3>
              <p>
                To provide a personalised experience, we collect:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Account information (email, username)</li>
                <li>Wellness data (daily logs, habits, scores)</li>
                <li>Lifecycle information (life stage, cycle details, pregnancy status)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">3. How We Use Your Data</h3>
              <p>
                We use your data strictly to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Customise your daily recommendations and protocols</li>
                <li>Provide insights into your personal health journey</li>
                <li>Communicate relevant updates and booking confirmations</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">4. Data Security</h3>
              <p>
                Your data is stored securely using industry-standard encryption. We do not sell your personal or wellness data to third parties.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">5. Your Rights</h3>
              <p>
                You have the right to access, correct, or delete your data at any time via the Settings menu in the application.
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
