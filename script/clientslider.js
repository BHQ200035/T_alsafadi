(function($) {
    $(document).ready(function(){
        
        $('.slick-projects-slider').slick({
            dots: true,        
            autoplay: true,    
            autoplaySpeed: 3000, 
            arrows: true,      
            infinite: true,    
            rtl: true,         
            
            // 💡 التعديل هنا: تقليل قيمة 'speed'
            speed: 300,        // الحركة ستتم خلال 300 مللي ثانية (أسرع)
            
            slidesToShow: 4,   
            slidesToScroll: 1, 
            
            // ... (باقي إعدادات التجاوبية) ...
            responsive: [
                {
                    breakpoint: 992, 
                    settings: {
                        slidesToShow: 2, 
                        slidesToScroll: 1,
                        arrows: false 
                    }
                },
                {
                    breakpoint: 600, 
                    settings: {
                        slidesToShow: 1, 
                        slidesToScroll: 1,
                        arrows: false 
                    }
                }
            ]
        });
        
    });
})(jQuery);