const fs = require('fs');
const file = '/home/mahesh/Desktop/Projects_001/Ghostcod/nextjs-multiworker/apps/web/src/components/content-repurposer.tsx';
let data = fs.readFileSync(file, 'utf8');

const target = `{/* Facebook Direct Publish Component */}
                      {formatId === "facebook" && (
                        <div className="pt-2 border-t border-border mt-4">
                          {facebookConnected ? (
                            publishedUrl ? (
                              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                                <CheckCheck className="w-4 h-4 text-green-400 shrink-0" />
                                <span className="text-green-400 text-sm">
                                  Published!{" "}
                                  <a href={publishedUrl} target="_blank" rel="noopener noreferrer"
                                    className="underline underline-offset-2">
                                    View post →
                                  </a>
                                </span>
                              </div>
                            ) : (
                              <Button
                                onClick={publishToFacebook}
                                disabled={publishing}
                                className="w-full bg-[#1877F2] hover:bg-[#1465d0] text-white font-medium"
                              >`;

const replace = `{/* Facebook Direct Publish Component */}
                      {formatId === "facebook" && (
                        <div className="pt-2 border-t border-border mt-4 space-y-4">
                          {/* ── Image Generation Section ── */}
                          <div className="border border-border rounded-xl overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-muted/20">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-violet-400" />
                                <span className="text-sm font-medium text-white">Post Image</span>
                                <Badge variant="outline" className="text-xs text-violet-400 border-violet-400/30">
                                  AI Generated
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={generateImage}
                                disabled={generatingImage}
                                className="text-xs text-muted-foreground hover:text-white gap-1.5"
                              >
                                {generatingImage ? (
                                  <>
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                    Generating...
                                  </>
                                ) : generatedImageUrl ? (
                                  <>
                                    <RefreshCw className="w-3 h-3" />
                                    Regenerate
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-3 h-3" />
                                    Generate Image
                                  </>
                                )}
                              </Button>
                            </div>

                            {/* Image preview or placeholder */}
                            <div className="p-4">
                              {imageError && (
                                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-3">
                                  <AlertCircle className="w-4 h-4 shrink-0" />
                                  {imageError}
                                </div>
                              )}

                              {generatingImage && !generatedImageUrl && (
                                <div className="aspect-square w-full max-w-sm mx-auto rounded-xl bg-muted/30 border border-border flex flex-col items-center justify-center gap-3 animate-pulse">
                                  <Sparkles className="w-8 h-8 text-violet-400" />
                                  <p className="text-sm text-muted-foreground">Generating your image...</p>
                                  <p className="text-xs text-muted-foreground">This may take up to 30 seconds</p>
                                </div>
                              )}

                              {generatedImageUrl && (
                                <div className="space-y-3">
                                  <img
                                    src={generatedImageUrl}
                                    alt="AI generated post image"
                                    className="w-full max-w-sm mx-auto rounded-xl border border-border object-cover"
                                  />
                                  {imagePromptUsed && (
                                    <p className="text-xs text-muted-foreground text-center">
                                      Prompt: {imagePromptUsed}
                                    </p>
                                  )}
                                </div>
                              )}

                              {!generatingImage && !generatedImageUrl && !imageError && (
                                <div className="aspect-video w-full max-w-sm mx-auto rounded-xl bg-muted/20 border border-dashed border-border flex flex-col items-center justify-center gap-2">
                                  <Sparkles className="w-6 h-6 text-muted-foreground/50" />
                                  <p className="text-xs text-muted-foreground">Click "Generate Image" to create a matching visual</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {facebookConnected ? (
                            publishedUrl ? (
                              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                                <CheckCheck className="w-4 h-4 text-green-400 shrink-0" />
                                <span className="text-green-400 text-sm">
                                  Published!{" "}
                                  <a href={publishedUrl} target="_blank" rel="noopener noreferrer"
                                    className="underline underline-offset-2">
                                    View post →
                                  </a>
                                </span>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {generatedImageUrl && (
                                  <p className="text-xs text-green-400 flex items-center gap-1.5">
                                    <CheckCheck className="w-3 h-3" />
                                    Image ready — will be published with your post
                                  </p>
                                )}
                                <Button
                                  onClick={publishToFacebook}
                                  disabled={publishing}
                                  className="w-full bg-[#1877F2] hover:bg-[#1465d0] text-white font-medium"
                                >`;

data = data.replace(target, replace);
fs.writeFileSync(file, data, 'utf8');
