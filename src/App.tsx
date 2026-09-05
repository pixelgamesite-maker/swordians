import { Router as WouterRouter, Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AudioProvider } from "@/audio/AudioProvider";
import Landing from "@/pages/landing";
import Callback from "@/pages/Auth/callback";
import Hub from "@/pages/hub";
import Leaderboard from "@/pages/leaderboard";
import Tasks from "@/pages/tasks";
import Play from "@/pages/play";

function App() {
  return (
    <div className="dark">
      <TooltipProvider>
        {/* AudioProvider sits above the router so the music survives navigation */}
        <AudioProvider>
          <WouterRouter>
            <Switch>
              <Route path="/" component={Landing} />
              <Route path="/auth/callback" component={Callback} />
              <Route path="/hub" component={Hub} />
              <Route path="/leaderboard" component={Leaderboard} />
              <Route path="/tasks" component={Tasks} />
              <Route path="/play" component={Play} />
              <Route>
                <div style={{
                  background: "#070a0e", width: "100vw", height: "100vh",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Press Start 2P', monospace", fontSize: "1rem", color: "#f0b429",
                }}>
                  404 — NOT FOUND
                </div>
              </Route>
            </Switch>
          </WouterRouter>
          <Toaster />
        </AudioProvider>
      </TooltipProvider>
    </div>
  );
}

export default App;
