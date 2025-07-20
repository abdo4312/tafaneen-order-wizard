import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products API routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });

  // Product Assistant API route
  app.post("/api/product-assistant", async (req, res) => {
    try {
      const { message, products } = req.body;

      // Simple local fallback response logic
      const messageWords = message.toLowerCase();
      
      // Check for common product queries
      if (messageWords.includes('برافو') || messageWords.includes('bravo')) {
        const bravoProducts = products.filter((p: any) => 
          p.name.toLowerCase().includes('برافو') || 
          p.brand === 'bravo'
        );
        
        if (bravoProducts.length > 0) {
          return res.json({ 
            reply: `نعم، لدينا أقلام برافو متوفرة! إليك ما لدينا:\n\n${bravoProducts.map((p: any) => 
              `• ${p.name} - ${p.price} جنيه\n  ${p.description || 'قلم عالي الجودة'}`
            ).join('\n\n')}\n\nجميع هذه الأقلام متوفرة حالياً. هل تريد إضافة أي منها للسلة؟`
          });
        }
      }
      
      if (messageWords.includes('روتو') || messageWords.includes('roto')) {
        const rotoProducts = products.filter((p: any) => 
          p.name.toLowerCase().includes('روتو') || 
          p.brand === 'roto'
        );
        
        if (rotoProducts.length > 0) {
          return res.json({ 
            reply: `أقلام روتو متوفرة لدينا! إليك المتاح:\n\n${rotoProducts.map((p: any) => 
              `• ${p.name} - ${p.price} جنيه\n  ${p.description || 'قلم ممتاز'}`
            ).join('\n\n')}\n\nكلها متوفرة حالياً!`
          });
        }
      }
      
      if (messageWords.includes('قلم') || messageWords.includes('اقلام')) {
        return res.json({ 
          reply: 'لدينا مجموعة واسعة من الأقلام المميزة! يمكنك العثور على أقلام برافو، روتو، بريما، فابر كاستل، ودومز. كل نوع له مميزاته الخاصة. أي نوع معين تبحث عنه؟'
        });
      }
      
      if (messageWords.includes('سعر') || messageWords.includes('كام') || messageWords.includes('تمن')) {
        return res.json({ 
          reply: 'أسعارنا تنافسية جداً! الأقلام الجافة تبدأ من 3 جنيه، والأقلام الرصاص من 2 جنيه. أي منتج محدد تريد معرفة سعره؟'
        });
      }
      
      return res.json({ 
        reply: 'أهلاً وسهلاً! أنا هنا لمساعدتك في العثور على ما تحتاجه من مكتبة تفانين. لدينا أقلام ممتازة من ماركات مختلفة مثل برافو وروتو وبريما. ما الذي تبحث عنه تحديداً؟'
      });

    } catch (error) {
      console.error('Error in product assistant:', error);
      res.status(500).json({ 
        reply: 'أهلاً وسهلاً! أنا مساعدك في مكتبة تفانين. كيف يمكنني مساعدتك اليوم؟ يمكنني إجابة أسئلتك حول المنتجات والأسعار.' 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
