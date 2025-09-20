import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Settings, Key, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface AIConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfigSave: (config: AIConfig) => void;
  currentConfig: AIConfig;
}

export interface AIConfig {
  apiKey: string;
  googleDocsUrl: string;
  isConfigured: boolean;
}

export function AIConfigDialog({ open, onOpenChange, onConfigSave, currentConfig }: AIConfigDialogProps) {
  const [config, setConfig] = useState<AIConfig>(currentConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSave = () => {
    if (!config.apiKey.trim()) {
      setTestResult({ success: false, message: 'API Key is required' });
      return;
    }

    const updatedConfig = {
      ...config,
      isConfigured: true
    };

    onConfigSave(updatedConfig);
    onOpenChange(false);
    setTestResult({ success: true, message: 'Configuration saved successfully!' });
  };

  const handleTestConnection = async () => {
    if (!config.apiKey.trim()) {
      setTestResult({ success: false, message: 'Please enter an API key first' });
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Campus Multilingual Assistant',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'x-ai/grok-4-fast:free',
          messages: [
            {
              role: 'user',
              content: 'Hello, this is a test message.'
            }
          ],
          max_tokens: 10
        })
      });

      if (response.ok) {
        setTestResult({ success: true, message: 'API connection successful!' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setTestResult({ 
          success: false, 
          message: `API Error: ${response.status} - ${errorData.error?.message || response.statusText}` 
        });
      }
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            AI Configuration
          </DialogTitle>
          <DialogDescription>
            Configure your OpenRouter API key and knowledge base to enable AI-powered responses.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Key className="h-4 w-4" />
                OpenRouter API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter your OpenRouter API key"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Get your API key from{' '}
                  <a 
                    href="https://openrouter.ai/keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    OpenRouter.ai
                  </a>
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleTestConnection} 
                  disabled={isLoading || !config.apiKey.trim()}
                  variant="outline"
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </Button>
              </div>

              {testResult && (
                <Alert variant={testResult.success ? "default" : "destructive"}>
                  {testResult.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{testResult.message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Knowledge Base Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" />
                Knowledge Base Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="googleDocsUrl">Google Docs URL (Optional)</Label>
                <Input
                  id="googleDocsUrl"
                  value={config.googleDocsUrl}
                  onChange={(e) => setConfig(prev => ({ ...prev, googleDocsUrl: e.target.value }))}
                  placeholder="https://docs.google.com/document/d/your-document-id/edit"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Provide a Google Docs link with your Q&A content. Make sure the document is publicly accessible.
                </p>
              </div>

              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  If no Google Docs URL is provided, the chatbot will use a default knowledge base with common campus queries.
                  The document should contain questions and answers in a clear format for best results.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configuration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={config.apiKey ? "default" : "secondary"}>
                  {config.apiKey ? "API Key Configured" : "API Key Missing"}
                </Badge>
                <Badge variant={config.googleDocsUrl ? "default" : "outline"}>
                  {config.googleDocsUrl ? "Custom Knowledge Base" : "Default Knowledge Base"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!config.apiKey.trim()}>
              Save Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}