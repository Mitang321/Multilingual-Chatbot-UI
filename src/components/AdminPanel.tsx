import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Plus, Edit, Trash2, Upload, FileText, Languages, Database } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  language: string;
  tags: string[];
  lastUpdated: Date;
}

const categories = ['Fees', 'Scholarships', 'Admissions', 'Academics', 'Campus Life', 'General'];
const languages = ['English', 'Hindi', 'Marathi', 'Telugu', 'Tamil'];

export function AdminPanel() {
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'What are the fee payment deadlines?',
      answer: 'Semester fees are due by the 15th of each month. Annual fees must be paid by March 31st. Late payment incurs additional charges.',
      category: 'Fees',
      language: 'English',
      tags: ['payment', 'deadline', 'fees'],
      lastUpdated: new Date('2024-01-10')
    },
    {
      id: '2',
      question: 'फीस भुगतान की अंतिम तारीख क्या है?',
      answer: 'सेमेस्टर फीस हर महीने की 15 तारीख तक देनी होती है। वार्षिक फीस 31 मार्च तक भुगतान करनी होती है। देर से भुगतान पर अतिरिक्त शुल्क लगता है।',
      category: 'Fees',
      language: 'Hindi',
      tags: ['भुगतान', 'अंतिम तारीख', 'फीस'],
      lastUpdated: new Date('2024-01-10')
    },
    {
      id: '3',
      question: 'How to apply for scholarships?',
      answer: 'Scholarships can be applied through the college portal. Merit-based applications open September 1-30, need-based applications are accepted year-round.',
      category: 'Scholarships',
      language: 'English',
      tags: ['application', 'merit', 'financial aid'],
      lastUpdated: new Date('2024-01-08')
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'All' || faq.language === selectedLanguage;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesLanguage && matchesSearch;
  });

  const handleSaveFaq = (faqData: Partial<FAQ>) => {
    if (editingFaq) {
      setFaqs(prev => prev.map(faq => 
        faq.id === editingFaq.id 
          ? { ...faq, ...faqData, lastUpdated: new Date() }
          : faq
      ));
    } else {
      const newFaq: FAQ = {
        id: Date.now().toString(),
        question: faqData.question || '',
        answer: faqData.answer || '',
        category: faqData.category || categories[0],
        language: faqData.language || languages[0],
        tags: faqData.tags || [],
        lastUpdated: new Date()
      };
      setFaqs(prev => [...prev, newFaq]);
    }
    setEditingFaq(null);
    setIsDialogOpen(false);
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="faqs" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faqs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            FAQ Management
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Content Import
          </TabsTrigger>
          <TabsTrigger value="languages" className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            Languages
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Sources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faqs">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>FAQ Management</CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { setEditingFaq(null); setIsDialogOpen(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add FAQ
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                      </DialogTitle>
                    </DialogHeader>
                    <FaqForm
                      faq={editingFaq}
                      onSave={handleSaveFaq}
                      onCancel={() => setIsDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Input
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Languages</SelectItem>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center text-sm text-muted-foreground">
                  Total: {filteredFaqs.length} FAQs
                </div>
              </div>

              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFaqs.map(faq => (
                      <TableRow key={faq.id}>
                        <TableCell className="max-w-xs">
                          <div className="truncate">{faq.question}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{faq.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{faq.language}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {faq.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {faq.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{faq.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {faq.lastUpdated.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingFaq(faq);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteFaq(faq.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <ContentImport />
        </TabsContent>

        <TabsContent value="languages">
          <LanguageManagement />
        </TabsContent>

        <TabsContent value="data">
          <DataSourceManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FaqForm({ faq, onSave, onCancel }: { 
  faq: FAQ | null; 
  onSave: (data: Partial<FAQ>) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    question: faq?.question || '',
    answer: faq?.answer || '',
    category: faq?.category || categories[0],
    language: faq?.language || languages[0],
    tags: faq?.tags.join(', ') || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="question">Question</Label>
        <Input
          id="question"
          value={formData.question}
          onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
          placeholder="Enter the question..."
          required
        />
      </div>
      
      <div>
        <Label htmlFor="answer">Answer</Label>
        <Textarea
          id="answer"
          value={formData.answer}
          onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
          placeholder="Enter the answer..."
          rows={4}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="language">Language</Label>
          <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="tag1, tag2, tag3"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {faq ? 'Update FAQ' : 'Add FAQ'}
        </Button>
      </div>
    </form>
  );
}

function ContentImport() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Content from Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg mb-2">Upload PDF, Word, or text files</p>
          <p className="text-sm text-gray-500 mb-4">
            The system will extract Q&A pairs automatically
          </p>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Choose Files
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Supported Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• PDF documents</li>
                <li>• Word documents (.docx)</li>
                <li>• Text files (.txt)</li>
                <li>• CSV files with Q&A columns</li>
                <li>• JSON structured data</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Processing Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Fee Guidelines.pdf</span>
                  <Badge variant="secondary">Processing</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Admission Rules.docx</span>
                  <Badge>Completed</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Scholarship Info.pdf</span>
                  <Badge>Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

function LanguageManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Language Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {languages.map(language => (
            <Card key={language}>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  {language}
                  <Badge variant="secondary">Active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>FAQs available:</span>
                    <span>156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Translation quality:</span>
                    <Badge variant="outline">95%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Last updated:</span>
                    <span>2 days ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add New Language</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input placeholder="Language name (e.g., Bengali)" className="flex-1" />
              <Input placeholder="Language code (e.g., bn)" className="w-24" />
              <Button>Add Language</Button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

function DataSourceManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Source Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">College Database</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Student Information System</span>
                  <Badge>Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Fee Management System</span>
                  <Badge>Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Academic Calendar</span>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <Button size="sm" className="w-full mt-2">Configure Connections</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">External APIs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Government Scholarship Portal</span>
                  <Badge variant="outline">Not Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">University Exam Results</span>
                  <Badge variant="outline">Not Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Library Management</span>
                  <Badge>Connected</Badge>
                </div>
                <Button size="sm" className="w-full mt-2">Add API Integration</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Real-time Data Sync</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Last sync:</span>
                <span className="text-sm text-muted-foreground">5 minutes ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sync frequency:</span>
                <Select defaultValue="15">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button size="sm">Force Sync Now</Button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}