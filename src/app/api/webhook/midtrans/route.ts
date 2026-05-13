import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { db } from '@/lib/firebase'; // Pastikan path ini sesuai dengan inisialisasi firebase kamu
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // 1. Verifikasi Keamanan (Jangan sampai orang iseng nembak webhook ini)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const hash = crypto.createHash('sha512').update(payload.order_id + payload.status_code + payload.gross_amount + serverKey).digest('hex');
    
    if (hash !== payload.signature_key) {
      return NextResponse.json({ error: 'Signature Key tidak valid!' }, { status: 403 });
    }

    // 2. Cek Status Transaksi Midtrans
    const transactionStatus = payload.transaction_status;
    const fraudStatus = payload.fraud_status;

    if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
      if (fraudStatus == 'challenge') {
        // Jangan diapa-apain kalau masih challenge
        return NextResponse.json({ message: 'Status Challenge' }, { status: 200 });
      }

      // --- 3. TRANSAKSI LUNAS: UPDATE FIREBASE ---
      let orderData = null;
      let docId = '';

      const q = query(collection(db, "orders"), where("orderId", "==", payload.order_id));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const orderDoc = querySnapshot.docs[0];
        docId = orderDoc.id;
        orderData = orderDoc.data();
        
        // Update status jadi PAID
        await updateDoc(doc(db, "orders", docId), {
          status: 'PAID',
          paymentType: payload.payment_type,
          paidAt: payload.settlement_time || new Date().toISOString()
        });
      }

      // --- 4. KIRIM EMAIL NOTIFIKASI VIA GOOGLE WORKSPACE ---
      if (orderData && orderData.customerEmail) {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
          }
        });

        const mailOptions = {
          from: `"Bose Indonesia Official" <${process.env.SMTP_EMAIL}>`,
          to: orderData.customerEmail,
          subject: `Payment Received - Order #${payload.order_id}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; padding: 20px;">
              <h2 style="color: #131317; text-transform: uppercase;">Payment Successful! 🎉</h2>
              <p>Hi ${orderData.customerName},</p>
              <p>We have successfully received your payment of <strong>Rp ${parseInt(payload.gross_amount).toLocaleString('id-ID')}</strong>.</p>
              <p>Your order is now being processed. You can track your shipment status on the "My Order" page in your account.</p>
              
              <div style="background-color: #fcfcfc; padding: 15px; margin-top: 20px; border-left: 4px solid #000;">
                <p style="margin: 0;"><strong>Order ID:</strong> ${payload.order_id}</p>
                <p style="margin: 5px 0 0 0;"><strong>Payment Method:</strong> ${payload.payment_type.toUpperCase()}</p>
              </div>

              <p style="margin-top: 30px; font-size: 12px; color: #888;">Thank you for shopping with Bose Indonesia.</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email lunas terkirim ke ${orderData.customerEmail}`);
      }

      return NextResponse.json({ message: 'Order berhasil diupdate & Email terkirim' }, { status: 200 });
    }

    // Kalau statusnya pending/cancel/expire, biarkan saja atau buat logika lain jika perlu
    return NextResponse.json({ message: 'Webhook diterima' }, { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: 'Gagal memproses webhook' }, { status: 500 });
  }
}