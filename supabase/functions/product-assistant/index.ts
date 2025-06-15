
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
    const DEEPSEEK_API_KEY = 'sk-48b5981674e9420b9684c35e6c10e412';

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
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'خطأ في API');
    }

    const assistantReply = data.choices[0].message.content;

    return new Response(JSON.stringify({ reply: assistantReply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('خطأ في المساعد الذكي:', error);
    return new Response(JSON.stringify({ 
      error: 'عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
