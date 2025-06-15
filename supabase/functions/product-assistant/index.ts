
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, products } = await req.json();
    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY') || 'sk-48b5981674e9420b9684c35e6c10e412';

    const systemPrompt = `أنت مساعد ذكي في مكتبة تفانين المصرية. أجب على أسئلة العملاء باللغة العربية بطريقة ودودة ومفيدة.

معلومات عن المنتجات المتوفرة:
${JSON.stringify(products, null, 2)}

قم بالإجابة على الأسئلة حول:
- توفر المنتجات (متوفر/غير متوفر)
- الأسعار
- المواصفات والخصائص
- الماركات المتاحة
- النصائح والتوصيات
- المقارنات بين المنتجات

إذا سأل العميل عن منتج غير موجود، اقترح بدائل مشابهة من المنتجات المتوفرة.
كن ودودًا ومساعدًا كما لو كنت موظف حقيقي في المكتبة.`;

    console.log('Attempting to call DeepSeek API...');

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log('DeepSeek API response:', data);
    
    if (!response.ok) {
      console.error('DeepSeek API error:', data);
      // If DeepSeek fails, provide a fallback response
      const fallbackResponse = getFallbackResponse(message, products);
      return new Response(JSON.stringify({ reply: fallbackResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const assistantReply = data.choices[0].message.content;

    return new Response(JSON.stringify({ reply: assistantReply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('خطأ في المساعد الذكي:', error);
    
    // Provide fallback response when API fails
    try {
      const { message, products } = await req.json();
      const fallbackResponse = getFallbackResponse(message, products);
      return new Response(JSON.stringify({ reply: fallbackResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (fallbackError) {
      return new Response(JSON.stringify({ 
        reply: 'أهلاً وسهلاً! أنا مساعدك في مكتبة تفانين. كيف يمكنني مساعدتك اليوم؟ يمكنني إجابة أسئلتك حول المنتجات والأسعار.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }
});

function getFallbackResponse(message: string, products: any[]): string {
  const messageWords = message.toLowerCase();
  
  // Check for common product queries
  if (messageWords.includes('برافو') || messageWords.includes('bravo')) {
    const bravoProducts = products.filter(p => 
      p.name.toLowerCase().includes('برافو') || 
      p.brand === 'bravo'
    );
    
    if (bravoProducts.length > 0) {
      return `نعم، لدينا أقلام برافو متوفرة! إليك ما لدينا:\n\n${bravoProducts.map(p => 
        `• ${p.name} - ${p.price} جنيه\n  ${p.description || 'قلم عالي الجودة'}`
      ).join('\n\n')}\n\nجميع هذه الأقلام متوفرة حالياً. هل تريد إضافة أي منها للسلة؟`;
    }
  }
  
  if (messageWords.includes('روتو') || messageWords.includes('roto')) {
    const rotoProducts = products.filter(p => 
      p.name.toLowerCase().includes('روتو') || 
      p.brand === 'roto'
    );
    
    if (rotoProducts.length > 0) {
      return `أقلام روتو متوفرة لدينا! إليك المتاح:\n\n${rotoProducts.map(p => 
        `• ${p.name} - ${p.price} جنيه\n  ${p.description || 'قلم ممتاز'}`
      ).join('\n\n')}\n\nكلها متوفرة حالياً!`;
    }
  }
  
  if (messageWords.includes('قلم') || messageWords.includes('اقلام')) {
    return 'لدينا مجموعة واسعة من الأقلام المميزة! يمكنك العثور على أقلام برافو، روتو، بريما، فابر كاستل، ودومز. كل نوع له مميزاته الخاصة. أي نوع معين تبحث عنه؟';
  }
  
  if (messageWords.includes('سعر') || messageWords.includes('كام') || messageWords.includes('تمن')) {
    return 'أسعارنا تنافسية جداً! الأقلام الجافة تبدأ من 3 جنيه، والأقلام الرصاص من 2 جنيه. أي منتج محدد تريد معرفة سعره؟';
  }
  
  return 'أهلاً وسهلاً! أنا هنا لمساعدتك في العثور على ما تحتاجه من مكتبة تفانين. لدينا أقلام ممتازة من ماركات مختلفة مثل برافو وروتو وبريما. ما الذي تبحث عنه تحديداً؟';
}
