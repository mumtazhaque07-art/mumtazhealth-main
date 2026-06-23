const fs = require('fs');

const originalFile = fs.readFileSync('src/pages/ContentLibrary.bak.tsx', 'utf8');
const lines = originalFile.split('\n');

// Find the line where `const ContentLibrary = () => {` starts
const startIndex = lines.findIndex(line => line.includes('const ContentLibrary = () => {'));

if (startIndex === -1) {
  console.error("Could not find ContentLibrary function in the original file.");
  process.exit(1);
}

const importsAndTypes = lines.slice(0, startIndex).join('\n');

const newComponent = `
const libraryStages = [
  { id: 'stage1', label: '1. Cycle Health', icon: Flower2, match: ['menstrual', 'follicular', 'ovulatory', 'luteal', 'cycle-health'] },
  { id: 'stage2', label: '2. Fertility', icon: Heart, match: ['fertility', 'pre-conception'] },
  { id: 'stage3', label: '3. Pregnancy', icon: Baby, match: ['pregnancy', 'pregnant', 'trimester-1', 'trimester-2', 'trimester-3'] },
  { id: 'stage4', label: '4. Postpartum', icon: Activity, match: ['postpartum'] },
  { id: 'stage5', label: '5. Perimenopause', icon: Sparkles, match: ['perimenopause'] },
  { id: 'stage6', label: '6. Menopause', icon: Flame, match: ['menopause'] },
  { id: 'stage7', label: '7. Wise Woman', icon: Crown, match: ['post-menopause', 'wise-woman'] },
];

const ContentLibrary = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [userTier, setUserTier] = useState<string>("free");
  const [content, setContent] = useState<WellnessContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [savedContentIds, setSavedContentIds] = useState<Set<string>>(new Set());
  
  // Dialog state
  const [selectedContent, setSelectedContent] = useState<WellnessContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCrossroadsOpen, setIsCrossroadsOpen] = useState(false);

  const { isPregnancySafeMode, trimester } = usePregnancySafeMode();
  useGlobalLoading(loading);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    loadContent();
    if (user) {
      loadUserProfile();
      loadSavedContent();
    }
  }, [user]);

  // Handle URL stage param
  useEffect(() => {
    const stageParam = searchParams.get('stage');
    if (stageParam) {
      // Map legacy stage strings to new stage IDs if needed
      const mapping: Record<string, string> = {
        'menopause': 'stage6',
        'perimenopause': 'stage5',
        'pregnancy': 'stage3',
        'fertility': 'stage2',
        'postpartum': 'stage4'
      };
      if (mapping[stageParam]) {
        setActiveTab(mapping[stageParam]);
      } else {
        const found = libraryStages.find(s => s.id === stageParam);
        if (found) setActiveTab(stageParam);
      }
    }
  }, [searchParams]);

  const loadUserProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_wellness_profiles')
      .select('subscription_tier')
      .eq('user_id', user.id)
      .maybeSingle();
    setUserTier(data?.subscription_tier || 'free');
  };

  const loadContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('wellness_content')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setContent(data.map(item => ({
        ...item,
        doshas: item.doshas || [],
        benefits: item.benefits || [],
        cycle_phases: item.cycle_phases || [],
        pregnancy_statuses: item.pregnancy_statuses || [],
        tags: item.tags || []
      })));
    }
    setLoading(false);
  };

  const loadSavedContent = async () => {
    if (!user) return;
    const { data } = await supabase.from('user_saved_content').select('content_id').eq('user_id', user.id);
    if (data) setSavedContentIds(new Set(data.map(item => item.content_id)));
  };

  const toggleSaveContent = async (contentId: string) => {
    if (!user) {
      toast.error('Please log in to save content');
      return;
    }
    const isSaved = savedContentIds.has(contentId);
    if (isSaved) {
      await supabase.from('user_saved_content').delete().eq('user_id', user.id).eq('content_id', contentId);
      const newSaved = new Set(savedContentIds);
      newSaved.delete(contentId);
      setSavedContentIds(newSaved);
      toast.success('Removed from saved');
    } else {
      await supabase.from('user_saved_content').insert({ user_id: user.id, content_id: contentId });
      const newSaved = new Set(savedContentIds);
      newSaved.add(contentId);
      setSavedContentIds(newSaved);
      toast.success('Saved to your library');
    }
  };

  const getFilteredContent = () => {
    if (activeTab === 'all') return content;
    if (activeTab === 'favorites') return content.filter(c => savedContentIds.has(c.id));
    
    const stage = libraryStages.find(s => s.id === activeTab);
    if (!stage) return [];
    
    return content.filter(item => {
      // Check if item's cycle_phases or tags overlap with the stage's match array
      const itemPhases = Array.isArray(item.cycle_phases) ? item.cycle_phases : [];
      const itemTags = Array.isArray(item.tags) ? item.tags : [];
      
      const hasPhaseMatch = itemPhases.some(p => stage.match.includes(p.toLowerCase()));
      const hasTagMatch = itemTags.some(t => stage.match.includes(t.toLowerCase()));
      
      return hasPhaseMatch || hasTagMatch;
    });
  };

  // Maps database image URLs to imports (extracted from original file)
  const resolveImageUrl = (imageUrl: string | null | undefined): string | null => {
    if (!imageUrl) return null;
    const imageUrlMap: Record<string, string> = {
      '/src/assets/poses/seated-meditation.jpeg': seatedMeditation,
      '/src/assets/poses/seated-side-stretch.jpeg': seatedSideStretch,
      '/src/assets/poses/head-to-knee.jpeg': headToKnee,
      '/src/assets/poses/neck-shoulder-stretch.jpeg': neckShoulderStretch,
      '/src/assets/poses/prayer-pose.jpeg': prayerPose,
      '/src/assets/poses/pyramid-pose-blocks.jpeg': pyramidPoseBlocks,
      '/src/assets/poses/camel-pose.jpeg': camelPose,
      '/src/assets/poses/low-lunge-block.jpeg': lowLungeBlock,
      '/src/assets/poses/seated-welcome.jpeg': seatedWelcome,
      '/src/assets/poses/downward-dog-blocks.jpeg': downwardDogBlocks,
      '/src/assets/poses/lizard-pose.jpg': lizardPose,
      '/src/assets/poses/high-cobra-blocks.jpeg': highCobraBlocks,
      '/src/assets/poses/triangle-pose.jpeg': trianglePose,
      '/src/assets/poses/bridge-leg-lift.jpeg': bridgeLegLift,
      '/src/assets/poses/low-lunge-hip.jpeg': lowLungeHip,
      '/src/assets/poses/modified-chaturanga.jpeg': modifiedChaturanga,
      '/src/assets/poses/three-leg-plank.jpeg': threeLegPlank,
      '/src/assets/poses/high-lunge-twist.jpeg': highLungeTwist,
      '/src/assets/poses/baby-cobra-blocks.jpeg': babyCobraBlocks,
      '/src/assets/poses/bird-dog-stretch.jpeg': birdDogStretch,
      '/src/assets/joint-care-chair-yoga.jpg': jointCareChairYoga,
      '/src/assets/joint-care-wall-yoga.jpg': jointCareWallYoga,
      '/src/assets/joint-care-bed-mobility.jpg': jointCareBedMobility,
      '/src/assets/joint-care-abhyanga.jpg': jointCareAbhyanga,
      '/src/assets/joint-care-golden-milk.jpg': jointCareGoldenMilk,
      '/src/assets/joint-care-kitchari.jpg': jointCareKitchari,
      '/src/assets/joint-care-bone-soup.jpg': jointCareBoneSoup,
      '/src/assets/joint-care-breathwork.jpg': jointCareBreathwork,
      '/src/assets/joint-care-functional.jpg': jointCareFunctional,
      '/src/assets/blood-sugar-energy-support.jpg': bloodSugarEnergySupport,
      '/src/assets/poses/eagle-arms-seated.jpeg': eagleArmsSeated,
      '/src/assets/poses/reclined-figure-four.jpeg': recliningFigureFour,
      '/src/assets/poses/supported-fish-pose.jpeg': supportedFishPose,
      '/src/assets/poses/half-moon-pose.jpeg': halfMoonPose,
      '/src/assets/poses/warrior-three.jpeg': warriorThree,
      '/src/assets/poses/locust-pose.jpeg': locustPose,
      '/src/assets/poses/fish-pose-legs-up.jpeg': fishPoseLegsUp,
      '/src/assets/poses/forearm-reclined-hero.jpeg': forearmReclinedHero,
      '/src/assets/poses/compass-pose.jpeg': compassPose,
      '/src/assets/poses/revolved-head-to-knee.jpeg': revolvedHeadToKnee,
      '/src/assets/poses/legs-up-the-wall.png': legsUpTheWall,
    };
    return imageUrlMap[imageUrl] || null;
  };

  const getContentImage = (type: string, tags?: string[], imageUrl?: string, title: string = '') => {
    if (title && title.toLowerCase().includes('legs up')) return legsUpTheWall;
    if (imageUrl) {
      const resolved = resolveImageUrl(imageUrl);
      if (resolved) return resolved;
    }
    // Simple fallback
    switch (type) {
      case 'yoga': return mumtazYoga6;
      case 'meditation': return mumtazYoga8;
      case 'nutrition': return nutritionImage;
      default: return mumtazYoga6;
    }
  };

  const renderContentCard = (item: WellnessContent) => {
    const isLocked = false; // Simplified for now, everything is visible
    return (
      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow relative">
        <div className="h-40 overflow-hidden bg-muted relative">
          <img 
            src={getContentImage(item.content_type, item.tags, item.image_url, item.title)}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-2 left-2 capitalize text-xs">
            {item.content_type}
          </Badge>
          <Badge className="absolute top-2 right-2 bg-black/60 capitalize text-xs">
            {item.tier_requirement === 'free' ? 'Foundational' : item.tier_requirement === 'standard' ? 'Premium' : 'VIP'}
          </Badge>
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base line-clamp-2">{item.title}</CardTitle>
            <Button
              variant={savedContentIds.has(item.id) ? "default" : "outline"}
              size="sm"
              className={\`flex-shrink-0 text-xs \${savedContentIds.has(item.id) ? 'bg-primary/90 hover:bg-primary' : ''}\`}
              onClick={(e) => { e.stopPropagation(); toggleSaveContent(item.id); }}
            >
              <Heart className={\`h-3.5 w-3.5 mr-1.5 \${savedContentIds.has(item.id) ? 'fill-white' : ''}\`} />
              {savedContentIds.has(item.id) ? 'Saved' : 'Save'}
            </Button>
          </div>
          <CardDescription className="line-clamp-2 text-sm">{item.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <Button 
            className="w-full" 
            size="sm"
            onClick={() => { setSelectedContent(item); setIsDialogOpen(true); }}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderTierGroup = (tierValue: string, title: string, items: WellnessContent[]) => {
    const tierItems = items.filter(item => item.tier_requirement === tierValue || (!item.tier_requirement && tierValue === 'free'));
    if (tierItems.length === 0) return null;
    
    return (
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b">
          {tierValue === 'premium' ? <Crown className="h-5 w-5 text-amber-500" /> : 
           tierValue === 'standard' ? <Sparkles className="h-5 w-5 text-purple-500" /> : 
           <Leaf className="h-5 w-5 text-green-500" />}
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tierItems.map(renderContentCard)}
        </div>
      </div>
    );
  };

  const filteredContent = getFilteredContent();

  return (
    <div className="min-h-screen bg-wellness-sand/30 pb-20">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-serif">
            The Content Library
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            A simplified, 7-stage holistic journey. Select your current life stage below.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ScrollArea className="w-full border-b pb-4 mb-8">
            <TabsList className="w-full justify-start h-auto bg-transparent p-0 inline-flex space-x-2">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 py-2"
              >
                All Content
              </TabsTrigger>
              <TabsTrigger 
                value="favorites"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 py-2"
              >
                <Heart className="w-4 h-4 mr-2" /> Favorites
              </TabsTrigger>
              
              <div className="w-px h-8 bg-border mx-2" />
              
              {libraryStages.map(stage => (
                <TabsTrigger 
                  key={stage.id}
                  value={stage.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 py-2"
                >
                  <stage.icon className="w-4 h-4 mr-2" /> {stage.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

          {loading ? (
            <ContentGridSkeleton count={6} />
          ) : filteredContent.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">No Content Yet</h3>
              <p className="text-muted-foreground">Content for this stage is currently being prepared.</p>
            </Card>
          ) : (
            <div>
              {renderTierGroup('free', 'Foundational Journey (Free)', filteredContent)}
              {renderTierGroup('standard', 'Premium Journey (Standard)', filteredContent)}
              {renderTierGroup('premium', 'VIP Journey (Premium)', filteredContent)}
            </div>
          )}
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          {selectedContent && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-2">
                  <DialogTitle className="flex items-center gap-2 flex-1">
                    <span className="line-clamp-1">{selectedContent.title}</span>
                  </DialogTitle>
                </div>
                <DialogDescription>
                  {selectedContent.description}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[50vh]">
                <div className="space-y-4 pt-4">
                  <PoseImageSequence
                    contentId={selectedContent.id}
                    videoUrl={selectedContent.video_url}
                    isPremiumUser={userTier === 'premium'}
                    isPremiumContent={selectedContent.tier_requirement === 'premium'}
                  />
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3 pb-2 border-b">The Practice</h3>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {selectedContent.detailed_guidance || "Please follow along with the video/audio."}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentLibrary;
`;

fs.writeFileSync('src/pages/ContentLibrary.tsx', importsAndTypes + newComponent);
console.log("Successfully generated simplified ContentLibrary.tsx");
