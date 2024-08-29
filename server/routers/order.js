import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../model/order.js';
import { isAdmin, isAuth } from '../stn/utils.js'; 

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const order = await Order.find();
    res.send(order);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error To Get Order", error: error.message }); 
  }
});


router.get('/users-with-orders', async (req, res) => {
  try {
    const usersWithOrders = await Order.find().populate('user').select('user').distinct('user');

    res.status(200).json(usersWithOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users'  , error });
  }
});



router.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,  
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice, 
      user: req.user._id,
    }); 

    const order = await newOrder.save();
    res.status(201).send({ message: 'New Order Created', order });
  })
); 


router.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

router.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

router.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

 
router.put("/pay/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        isPaid: req.body.isPaid,
      },
      { new: true }
    );
    if (!order) {
      return res.status(404).send(`we don't have her this order`);
    }
    res.send(order);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error put order", error: error.message });
  }
});

router.put("/delivery/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        isDelivered: req.body.isDelivered,
      },
      { new: true }
    );
    if (!order) {
      return res.status(404).send(`we don't have her this order`);
    }
    res.send(order);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error put order", error: error.message });
  }
});
 

router.get('/totalPrice', async (req, res) => {
  try {
    const orders = await Order.find();

    const totalPrice = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.json({ totalPrice });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error }); 
  }
});


router.get('/dashboard', async (req, res) => {
  try {
    // حساب العدد الإجمالي للطلبات
    const totalOrders = await Order.countDocuments();

    // حساب عدد الطلبات المكتملة
    const completedOrders = await Order.countDocuments({ isDelivered: true });

    // حساب عدد الطلبات المعلقة
    const pendingOrders = await Order.countDocuments({ isDelivered: false });

    // حساب إجمالي الإيرادات
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    // تحقق من أن نتيجة الإيرادات ليست فارغة
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // حساب عدد الطلبات المدفوعة
    const paidOrders = await Order.countDocuments({ isPaid: true });

    // حساب عدد الطلبات غير المدفوعة
    const unpaidOrders = await Order.countDocuments({ isPaid: false });

    // إرسال البيانات إلى العميل
    res.json({
      totalOrders,
      completedOrders,
      pendingOrders,
      totalRevenue,
      paidOrders,
      unpaidOrders,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.delete("/:id", async (req, res) => {
  try { 
    const order = await Order.findByIdAndRemove(req.params.id);
 
    if (!order) {
      return res.status(404).send(`we don't have her this order `);
    }
    res.send(order);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error remove order", error: error.message });
  }
});
 

export default router;