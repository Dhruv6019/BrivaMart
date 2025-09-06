import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Package, Truck, CheckCircle, Clock, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const OrderHistory = () => {
  const [statusFilter, setStatusFilter] = useState('all');

  const handleTrackOrder = (orderId: string) => {
    toast.info(`Tracking order ${orderId}`, {
      description: "Redirecting to tracking page..."
    });
    // In a real app, this would navigate to a tracking page
    setTimeout(() => {
      window.open(`/track-order/${orderId}`, '_blank');
    }, 1000);
  };

  const handleViewDetails = (orderId: string) => {
    toast.info(`Loading order details for ${orderId}`);
    // In a real app, this would navigate to order details page
    setTimeout(() => {
      window.location.href = `/order-details/${orderId}`;
    }, 500);
  };

  // Mock order data
  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 156.99,
      items: [
        { name: 'Professional Chef Knife', quantity: 1, price: 89.99 },
        { name: 'Cutting Board Set', quantity: 1, price: 67.00 }
      ]
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-20',
      status: 'shipped',
      total: 234.50,
      items: [
        { name: 'Power Drill Set', quantity: 1, price: 159.99 },
        { name: 'Screwdriver Kit', quantity: 1, price: 74.51 }
      ]
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-22',
      status: 'processing',
      total: 89.99,
      items: [
        { name: 'Garden Shovel', quantity: 2, price: 44.99 }
      ]
    },
    {
      id: 'ORD-2024-004',
      date: '2024-01-25',
      status: 'pending',
      total: 199.98,
      items: [
        { name: 'Smart Phone Case', quantity: 1, price: 29.99 },
        { name: 'Wireless Charger', quantity: 1, price: 49.99 },
        { name: 'Home Decor Vase', quantity: 1, price: 119.99 }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'default';
      case 'shipped':
        return 'default';
      case 'delivered':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Order History</h1>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
                <p className="text-muted-foreground mb-6">
                  {statusFilter === 'all' 
                    ? "You haven't placed any orders yet."
                    : `No orders with status "${statusFilter}" found.`
                  }
                </p>
                <Button asChild>
                  <a href="/products">Start Shopping</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <p className="text-muted-foreground">
                          Ordered on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusColor(order.status)} className="mb-2">
                          <span className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </Badge>
                        <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">${item.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t sm:flex-nowrap">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 sm:flex-none"
                        onClick={() => handleTrackOrder(order.id)}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Track Order
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 sm:flex-none"
                        onClick={() => handleViewDetails(order.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderHistory;