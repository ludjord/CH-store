import Order from '../models/orderModel.js';
import mongoose from 'mongoose';
import sendEmail from '../utils/sendEmail.js';

// Runtime mock state cache
let runtimeOrders = [
  { _id: '1', user: { name: 'John Doe' }, totalPrice: 35000000, isPaid: true, createdAt: new Date() },
  { _id: '2', user: { name: 'Jane Smith' }, totalPrice: 18500000, isPaid: true, createdAt: new Date(Date.now() - 86400000) },
  { _id: '3', user: { name: 'Ahmad Faiz' }, totalPrice: 5200000, isPaid: true, createdAt: new Date(Date.now() - 172800000) }
];

export const getOrders = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(runtimeOrders); 
  }
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    if (orders.length === 0) return res.json(runtimeOrders);
    res.json(orders);
  } catch (error) { res.status(500).json({ message: 'Server error', error: error.message }); }
};

export const createOrder = async (req, res) => {
  const { orderItems, totalPrice } = req.body;
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'Keranjang Kosong!' });
  }

  const simulatedUserName = req.user ? req.user.name : 'Guest Customer';

  if (mongoose.connection.readyState !== 1) {
    const order = {
       _id: 'ord_' + Date.now(),
       user: { name: simulatedUserName },
       orderItems,
       totalPrice,
       isPaid: false,
       createdAt: new Date()
    };
    runtimeOrders.push(order);
    return res.status(201).json(order);
  }

  try {
    const order = new Order({
      user: req.user?._id || null,
      orderItems,
      totalPrice
    });
    const createdOrder = await order.save();
    
    if (mongoose.connection.readyState === 1) {
      sendEmail({
        email: req.user?.email || process.env.FROM_EMAIL,
        subject: `Pesanan Baru Diterima - ${createdOrder._id}`,
        html: `<h1>Pesanan Berhasil!</h1><p>Pesanan Anda <b>#${createdOrder._id}</b> telah kami terima. Silakan lakukan konfirmasi pembayaran ke Admin.</p>`
      }).catch(err => console.error('Email Fail:', err));
    }

    res.status(201).json(createdOrder);
  } catch (error) { res.status(500).json({ message: 'Error Server', error: error.message }); }
};

export const getPaymentToken = async (req, res) => {
  // Karena Midtrans dihapus, fungsi ini hanya mengembalikan instruksi pembayaran manual
  res.json({ 
    message: 'Manual Payment Mode', 
    instruction: 'Silakan hubungi Admin untuk konfirmasi pembayaran manual.',
    mock: true 
  });
};

export const updateOrderToPaidManual = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'email name');
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      const updatedOrder = await order.save();
      
      // Email Notifikasi Lunas
      sendEmail({
        email: order.user?.email || process.env.FROM_EMAIL,
        subject: 'Pembayaran Diterima - CHSTORE',
        html: `<h1>Pembayaran Sukses!</h1><p>Halo ${order.user?.name || 'Pelanggan'}, pembayaran untuk pesanan <b>#${order._id}</b> telah kami terima. Barang akan segera diproses!</p>`
      }).catch(err => console.error('Email Fail:', err));

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order Not Found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateOrderToDelivered = async (req, res) => {
  const { trackingNumber, shippingStatus } = req.body;
  if(mongoose.connection.readyState !== 1) return res.status(500).json({message: 'Sistem Resi (Ekspedisi) menolak simulasi. Koneksikan MongoDB.'});
  
  try {
     const order = await Order.findById(req.params.id);
     if(!order) return res.status(404).json({ message: 'Order Not Found' });
     
     if(shippingStatus) order.shippingStatus = shippingStatus;
     if(trackingNumber) order.trackingNumber = trackingNumber;
     
     const updatedOrder = await order.save();

     if (shippingStatus === 'Shipped' && order.user) {
        const populateUser = await Order.findById(order._id).populate('user', 'email name');
        sendEmail({
           email: populateUser.user?.email || process.env.FROM_EMAIL,
           subject: 'Pesanan Anda Sedang Dikirim! 📦',
           html: `<h1>Pesanan Terkirim!</h1><p>Halo, pesanan Anda <b>#${order._id}</b> telah diserahkan ke kurir.</p><p><b>Nomor Resi:</b> ${trackingNumber || 'Dalam Proses'}</p><p>Pantau perjalanan paket Anda di menu Pesanan Saya.</p>`
        }).catch(err => console.error('Email Fail:', err));
     }

     res.status(200).json(updatedOrder);
  } catch(e) { 
     res.status(500).json({ message: e.message }); 
  }
};
