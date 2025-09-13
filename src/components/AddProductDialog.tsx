import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Upload, Download, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { categories, products } from '../data/mockData';
import { Product } from '../types';
import { ProductService } from '../services/productService';

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProductDialog: React.FC<AddProductDialogProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('manual');
  const [isLoading, setIsLoading] = useState(false);
  
  // Manual form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    subcategory: '',
    brand: '',
    stockQuantity: '',
    lowStockAlert: '',
    specifications: {} as Record<string, string>,
    tags: [] as string[],
    images: [] as string[]
  });

  const [newSpec, setNewSpec] = useState({ key: '', value: '' });
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSpecification = () => {
    if (newSpec.key && newSpec.value) {
      setFormData(prev => ({
        ...prev,
        specifications: { ...prev.specifications, [newSpec.key]: newSpec.value }
      }));
      setNewSpec({ key: '', value: '' });
    }
  };

  const removeSpecification = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleManualSubmit = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields (Name, Price, Category).");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await ProductService.createProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        subcategory: formData.subcategory,
        brand: formData.brand,
        images: formData.images.length > 0 ? formData.images : ['/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png'],
        specifications: formData.specifications,
        tags: formData.tags,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        lowStockAlert: parseInt(formData.lowStockAlert) || 5,
        featured: false,
        isNew: true,
        onSale: false
      });

      if (result.success) {
        toast.success("Product has been successfully added to the catalog.");
        onClose();
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          originalPrice: '',
          category: '',
          subcategory: '',
          brand: '',
          stockQuantity: '',
          lowStockAlert: '',
          specifications: {},
          tags: [],
          images: []
        });
      } else {
        toast.error(result.error || 'Failed to add product');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      toast.error("Please upload an Excel file (.xlsx, .xls) or CSV file.");
      return;
    }

    setIsLoading(true);
    
    // Simulate file processing
    setTimeout(() => {
      // Mock adding 3 products from Excel
      const mockExcelProducts = [
        {
          id: `excel-${Date.now()}-1`,
          name: 'Premium Kitchen Mixer',
          description: 'High-performance stand mixer for professional baking',
          price: 299,
          category: 'Kitchen Ware',
          brand: 'KitchenPro',
          stockQuantity: 25,
          lowStockAlert: 5
        },
        {
          id: `excel-${Date.now()}-2`,
          name: 'Adjustable Wrench Set',
          description: 'Professional-grade adjustable wrench set',
          price: 45,
          category: 'Hardware',
          brand: 'ToolMaster',
          stockQuantity: 50,
          lowStockAlert: 10
        },
        {
          id: `excel-${Date.now()}-3`,
          name: 'Phone Case with Stand',
          description: 'Protective case with built-in stand functionality',
          price: 25,
          category: 'Mobile Accessory',
          brand: 'CaseTech',
          stockQuantity: 100,
          lowStockAlert: 20
        }
      ];

      mockExcelProducts.forEach(productData => {
        const newProduct: Product = {
          ...productData,
          images: ['/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png'],
          subcategory: '',
          rating: 0,
          reviewCount: 0,
          inStock: true,
          specifications: {},
          variants: [],
          tags: [],
          featured: false,
          isNew: true,
          onSale: false
        };
        products.push(newProduct);
      });

      toast.success(`Successfully imported ${mockExcelProducts.length} products from Excel file.`);
      
      setIsLoading(false);
      onClose();
    }, 2000);
  };

  const downloadExcelTemplate = () => {
    // Create a sample CSV content
    const csvContent = `Sr. No.,Product Name,Description,Price,Original Price,Category,Subcategory,Brand,Stock Quantity,Low Stock Alert,Specifications,Tags
1,Sample Kitchen Knife,High-quality stainless steel knife,49.99,59.99,Kitchen Ware,Knives,ProChef,25,5,"Material:Stainless Steel|Handle:Ergonomic","Kitchen,Cooking,Steel"
2,Sample Power Tool,Cordless drill with battery,129.99,,Hardware,Power Tools,PowerMax,15,3,"Voltage:20V|Torque:400 in-lbs","Tools,Cordless,DIY"`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Excel template has been downloaded to your computer.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="excel">Excel Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="Enter brand name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter product description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="originalPrice">Original Price</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="lowStockAlert">Low Stock Alert</Label>
                <Input
                  id="lowStockAlert"
                  type="number"
                  value={formData.lowStockAlert}
                  onChange={(e) => handleInputChange('lowStockAlert', e.target.value)}
                  placeholder="5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={(e) => handleInputChange('subcategory', e.target.value)}
                  placeholder="Enter subcategory"
                />
              </div>
            </div>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Specification name"
                    value={newSpec.key}
                    onChange={(e) => setNewSpec(prev => ({ ...prev, key: e.target.value }))}
                  />
                  <Input
                    placeholder="Value"
                    value={newSpec.value}
                    onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
                  />
                  <Button onClick={addSpecification} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {Object.entries(formData.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between bg-muted p-2 rounded">
                      <span><strong>{key}:</strong> {value}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpecification(key)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <div key={tag} className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm flex items-center gap-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-primary-foreground hover:text-primary-foreground"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleManualSubmit} disabled={isLoading}>
                {isLoading ? 'Adding Product...' : 'Add Product'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="excel" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Excel Upload Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Upload an Excel file (.xlsx, .xls) or CSV file with your product data. 
                  Make sure your file follows the template format below:
                </p>
                
                <div className="bg-muted p-4 rounded">
                  <h4 className="font-semibold mb-2">Required Columns:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Sr. No.</div>
                    <div>• Product Name</div>
                    <div>• Description</div>
                    <div>• Price</div>
                    <div>• Category</div>
                    <div>• Brand</div>
                    <div>• Stock Quantity</div>
                    <div>• Low Stock Alert</div>
                  </div>
                  <h4 className="font-semibold mt-4 mb-2">Optional Columns:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Original Price</div>
                    <div>• Subcategory</div>
                    <div>• Specifications</div>
                    <div>• Tags</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={downloadExcelTemplate} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>

                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="excel-upload" className="cursor-pointer">
                      <span className="text-primary hover:underline">Click to upload</span> or drag and drop
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Excel files (.xlsx, .xls) or CSV files
                    </p>
                    <Input
                      id="excel-upload"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleExcelUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {isLoading && (
                  <div className="text-center py-4">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Processing Excel file...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;