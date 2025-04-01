tinymce.init({
    selector: '.editor',
    height: 300,
    menubar: false,
    plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | ' +
        'bold italic | alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image | removeformat help',
    
    // Semantik HTML için önemli ayarlar
    forced_root_block: 'p',           // Paragrafları <p> etiketi ile oluştur
    remove_trailing_brs: true,        // Sondaki gereksiz <br> etiketlerini kaldır
    valid_elements: '*[*]',           // Tüm geçerli HTML elementlerine izin ver
    valid_children: '+body[p|h1|h2|h3|h4|h5|h6|div|section|article]', // Body içinde geçerli elementler
    
    // Temizleme kuralları
    cleanup: true,
    cleanup_on_startup: true,
    convert_fonts_to_spans: true,     // Font etiketlerini span'a çevir
    remove_redundant_brs: true,       // Gereksiz <br> etiketlerini kaldır
    remove_linebreaks: true,          // Gereksiz satır sonlarını kaldır
    
    // Format tanımlamaları
    formats: {
        p: { block: 'p' },
        h1: { block: 'h1' },
        h2: { block: 'h2' },
        h3: { block: 'h3' },
        h4: { block: 'h4' },
        h5: { block: 'h5' },
        h6: { block: 'h6' }
    },
    
    // Blok formatları
    block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6',
    
    // İçerik stili
    content_style: `
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; }
        p { margin: 0 0 1em 0; }
        h1, h2, h3, h4, h5, h6 { margin: 1.5em 0 0.5em 0; }
    `,
    
    // Paste ayarları
    paste_as_text: false,            // Yapıştırılan içeriği düz metin olarak yapıştırma
    paste_word_valid_elements: 'p,b,strong,i,em,h1,h2,h3,h4,h5,h6,ul,ol,li', // Word'den yapıştırma için geçerli elementler
    paste_remove_styles: true,       // Yapıştırılan içerikteki stilleri kaldır
    paste_remove_spans: true,        // Yapıştırılan içerikteki span'ları kaldır
    
    // Özel temizleme kuralları
    extended_valid_elements: 'article[*],section[*],aside[*],figure[*],figcaption[*]',
    custom_elements: 'article,section,aside,figure,figcaption',
    
    // Dönüştürme ayarları
    schema: 'html5',                 // HTML5 şeması kullan
    element_format: 'html',          // XHTML yerine HTML formatı kullan
    
    // Editör başlatıldığında çalışacak fonksiyon
    setup: function(editor) {
        editor.on('BeforeSetContent', function(e) {
            // İçerik eklenmeden önce temizleme
            if (e.content) {
                // Gereksiz div'leri kaldır
                e.content = e.content.replace(/<div>/gi, '<p>');
                e.content = e.content.replace(/<\/div>/gi, '</p>');
                
                // Boş paragrafları kaldır
                e.content = e.content.replace(/<p>\s*<\/p>/gi, '');
            }
        });
    }
}); 