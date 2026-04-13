import { useEffect, useState } from 'react'
import { useGitHub } from '../hooks/useGitHub.js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  X, 
  GitPullRequest, 
  Lock, 
  Unlock, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function GitHubModal({ onClose, files, defaultRepoName }) {
    const [token, setToken] = useState('')
    const [repoName, setRepoName] = useState(defaultRepoName || 'flutter_arch_project')
    const [isPrivate, setIsPrivate] = useState(false)
    const [saveToken, setSaveToken] = useState(true)

    const { pushToGitHub, pushing, progress, error, successUrl } = useGitHub()

    useEffect(() => {
        const saved = localStorage.getItem('fas_github_token')
        if (saved) setToken(saved)
    }, [])

    const handlePush = () => {
        if (!token.trim() || !repoName.trim()) return

        if (saveToken) {
            localStorage.setItem('fas_github_token', token)
        } else {
            localStorage.removeItem('fas_github_token')
        }

        pushToGitHub(token, repoName, isPrivate, files)
    }

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={(e) => !pushing && e.target === e.currentTarget && onClose()} />
            
            <div className="relative w-full max-w-lg bg-card border border-border/80 rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-500">
                {/* Header */}
                <div className="p-8 pb-6 flex items-start gap-4 border-b border-border/40">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <GitPullRequest className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold tracking-tight">Push to GitHub</h2>
                        <p className="text-sm text-muted-foreground italic">Generate repository in one click 🔥</p>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={onClose} 
                        disabled={pushing}
                        className="rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 space-y-6">
                    {successUrl ? (
                        <div className="py-6 text-center space-y-6 animate-in zoom-in-95">
                            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold">Repository Created!</h3>
                                <p className="text-sm text-muted-foreground px-8 leading-relaxed">Your Flutter architecture has been successfully pushed and is ready for development.</p>
                            </div>
                            <Button asChild variant="cyber" className="w-full h-12 rounded-xl gap-2 font-bold">
                                <a href={successUrl} target="_blank" rel="noopener noreferrer">
                                    Open in GitHub <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex gap-4">
                                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div className="space-y-2">
                                    <p className="text-xs text-foreground/80 leading-relaxed">
                                        We need a <span className="font-bold text-primary">Personal Access Token (classic)</span> with the <code className="bg-primary/10 px-1 rounded text-primary">repo</code> scope.
                                    </p>
                                    <a 
                                        href="https://github.com/settings/tokens/new?scopes=repo&description=Flutter+Arch+Studio" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                                    >
                                        Generate Token Quickly <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-[11px] uppercase tracking-widest text-muted-foreground ml-1">GitHub Personal Token</Label>
                                    <Input
                                        type="password"
                                        value={token}
                                        onChange={e => setToken(e.target.value)}
                                        placeholder="ghp_xxxxxxxxxxxxxxxxxxx"
                                        disabled={pushing}
                                        className="h-12 bg-background/40 rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[11px] uppercase tracking-widest text-muted-foreground ml-1">Repository Name</Label>
                                    <Input
                                        type="text"
                                        value={repoName}
                                        onChange={e => setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-'))}
                                        placeholder="my-flutter-app"
                                        disabled={pushing}
                                        className="h-12 bg-background/40 rounded-xl font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div 
                                    className={cn(
                                        "flex items-center space-x-3 p-3 rounded-xl border border-border/50 transition-all cursor-pointer",
                                        isPrivate ? "bg-primary/5 border-primary/30" : "hover:bg-card/40"
                                    )}
                                    onClick={() => !pushing && setIsPrivate(!isPrivate)}
                                >
                                    <Checkbox checked={isPrivate} disabled={pushing} />
                                    <div className="flex-1 flex items-center gap-2 text-xs font-medium">
                                        {isPrivate ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                        Repository Private
                                    </div>
                                </div>

                                <div 
                                    className={cn(
                                        "flex items-center space-x-3 p-3 rounded-xl border border-border/50 transition-all cursor-pointer",
                                        saveToken ? "bg-primary/5 border-primary/30" : "hover:bg-card/40"
                                    )}
                                    onClick={() => !pushing && setSaveToken(!saveToken)}
                                >
                                    <Checkbox checked={saveToken} disabled={pushing} />
                                    <div className="text-xs font-medium">Remember token</div>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex gap-3 text-destructive animate-in shake-in">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <p className="text-[11px] font-mono leading-relaxed uppercase">{error}</p>
                                </div>
                            )}

                            {pushing && (
                                <div className="p-4 rounded-xl bg-secondary/50 border border-border/50 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                        <p className="text-xs font-bold uppercase tracking-widest text-primary">{progress}</p>
                                    </div>
                                    <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                                        <div className="h-full bg-primary animate-pulse w-full shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {!successUrl && (
                    <div className="p-8 pt-0 flex gap-3">
                        <Button 
                            variant="outline" 
                            className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest"
                            onClick={onClose} 
                            disabled={pushing}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="cyber"
                            className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest gap-2 group"
                            onClick={handlePush}
                            disabled={pushing || !token.trim() || !repoName.trim()}
                        >
                            {pushing ? 'CREATING...' : 'PUSH TO GITHUB'}
                            {!pushing && <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
