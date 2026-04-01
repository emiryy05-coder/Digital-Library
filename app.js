
function girisYap(){
    let kullanıcıAdi = document.getElementById("kAdi").value;
    let sifre = document.getElementById("sifre").value;

    console.log("Butona tıklandı!"); // Test için konsola yazar

    if(kullanıcıAdi==="admin" && sifre==="12345"){
         alert("Giriş Başarılı!");
        window.location.href="homePage.html";
    }else {
        alert("Kullanıcı adı veya şifre hatalı!");
    }
}


//----------------------------------------------------------------------------------------//

// Local Storage'da boş bir dizi oluşturuyoruz önce.
let kitaplar = JSON.parse(localStorage.getItem("kitaplar")) || [];

//  Sayfa açılır açılmaz LocalStorage'dan okunup ekrana basılmasını garanti altına alıyor"DOMContentLoaded"(Gemini3)
document.addEventListener("DOMContentLoaded", function() {
    envanterGuncelle()
    tabloyuGuncelle();
    romanTablosuGuncelle();
    polisiyeTablosuGuncelle();
    tarihTablosuGuncelle();
});


const kitapForm = document.getElementById("kitapEkleForm");// HTML'deki forma eriştik
if (kitapForm) {
    kitapForm.addEventListener("submit", function(e) {
        e.preventDefault(); //Local Storage'a kayıt için sayfa yenilenmesini durdurur

        const yeniKitap = { //Local Storage'da diziye kaydedeceğimiz parametrelere değerleri tanımlıyoruz
            id: Date.now(), // Benzersiz ID
            ad: document.getElementById("bookName").value,
            yazar: document.getElementById("authorName").value,
            isbn: document.getElementById("isbnNo").value,
            kategori: document.getElementById("categorySelect").value
        };

        kitaplar.push(yeniKitap); 
        localStorage.setItem("kitaplar", JSON.stringify(kitaplar)); // LS'daki Kitaplar key'ine ekletiyoruz

        tabloyuGuncelle();
        kitaplariDropdownaDoldur(); //Ödünç sayfasında listedeye doldurma yapıyor
        romanTablosuGuncelle();
        kitapForm.reset();
    });
}


function tabloyuGuncelle() {
    const tbody = document.getElementById("kitapTabloGövdesi");
    if (!tbody) return;

    tbody.innerHTML = ""; // Önce tabloyu temizle

    kitaplar.forEach((kitap) => {
        const satir = document.createElement("tr"); //Her kitap için satır yarattırdığımız kısım.

        satir.innerHTML = `
            <td>${kitap.isbn || "---"}</td>
            <td>${kitap.ad}</td>
            <td>${kitap.yazar}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="(${kitap.id})">Düzenle</button>
                <button class="btn btn-sm btn-outline-danger" onclick="kitapSil(${kitap.id})">Sil</button>
            </td>
        `;
        tbody.appendChild(satir); //tbody'yi parent yaptık ve ona "satir"ı yani child ı ekle dedik.
    });
}

function kitapSil(id) {
    //  Diziden sil
    kitaplar = kitaplar.filter(kitap => kitap.id !== id);
    
    //  Local Storage'ı güncelle
    localStorage.setItem("kitaplar", JSON.stringify(kitaplar));
    
    //  Ekranda görünen kısımları güncelle
    tabloyuGuncelle();         // Kitap listesi tablosu
    kitaplariDropdownaDoldur(); // Ödünç verme menüsü
    
    console.log("Kitap silindi ve dropdown güncellendi.");
}




// Bu fonksiyonu kitaplar dizisi her değiştiğinde veya sayfa yüklendiğinde çağıracağız
function kitaplariDropdownaDoldur() {
    const bookSelect = document.getElementById("bookSelect");
    if (!bookSelect) return;
// İlk seçeneği koru, diğerlerini temizle
    bookSelect.innerHTML = '<option selected disabled>Kitap Seçiniz...</option>';
    kitaplar.forEach(kitap => {
        const option = document.createElement("option");
        option.value = kitap.ad; // Veya kitap.id (hangisini saklamak istersen)
        option.textContent = `${kitap.ad} - ${kitap.yazar}`;
        bookSelect.appendChild(option);
    });
}


//----------------------------------------------------------------//

let oduncler = JSON.parse(localStorage.getItem("oduncler")) || [];
// Sayfa yüklendiğinde yapılacaklar
document.addEventListener("DOMContentLoaded", function() {
    tabloyuGuncelle();         // Kitap listesini güncelle
    tabloyuGuncelle2();        // Ödünç listesini güncelle
    kitaplariDropdownaDoldur(); // Seçim listesini doldur
    });

document.addEventListener("DOMContentLoaded", function() {
    tabloyuGuncelle2();
});
const oduncForm = document.getElementById("oduncEkleForm");// HTML'deki forma eriştik
if (oduncForm) {
    oduncForm.addEventListener("submit", function(e) {
        e.preventDefault(); //Local Storage'a kayıt için sayfa yenilenmesini durdurur
        tabloyuGuncelle2(); // Ödünç tablosunu yenile
        romanTablosuGuncelle(); // Roman tablosunu yenile (ödünç verilen kitap listeden düşer)
        polisiyeTablosuGuncelle(); 
        tarihTablosuGuncelle();

        const secilenKitap = document.getElementById("bookSelect").value;
        const uyeAdi = document.getElementById("memberName").value;
        const iadeTarihi = document.getElementById("returnDate").value;

        // Seçim Kontrolü
        if (secilenKitap === "Kitap Seçiniz..." || !secilenKitap) {
            alert("Lütfen bir kitap seçin!");
            return;
        }

        const yeniOdunc = { //Local Storage'da diziye kaydedeceğimiz parametrelere değerleri tanımlıyoruz
            id: Date.now(), // Benzersiz ID
            uye: document.getElementById("memberName").value,
            kitapAd: secilenKitap, // İsmi "kitapAd" olarak düzelttik (tabloyla uyumlu)
            tarih : document.getElementById("returnDate").value
        };
        if (yeniOdunc.kitapAd === "Kitap Seçiniz...") {
            alert("Lütfen bir kitap seçin!");
            return;
        }

        oduncler.push(yeniOdunc); 
        localStorage.setItem("oduncler", JSON.stringify(oduncler)); // LS'daki Kitaplar key'ine ekletiyoruz

        tabloyuGuncelle2();
        oduncForm.reset();
    });
}

// ÖDÜNÇ TABLOSUNU GÜNCELLEME 
function tabloyuGuncelle2() {
    const tbody = document.getElementById("oduncTabloBolmesi");
    if (!tbody) return;

    tbody.innerHTML = "";
    const bugün = new Date().setHours(0, 0, 0, 0);

    oduncler.forEach((kayit) => {
        // Tarih formatı kontrolü
        const iadeTarihi = kayit.tarih ? new Date(kayit.tarih).setHours(0, 0, 0, 0) : 0;
        let durumBadge = "";

        if (iadeTarihi < bugün) {
            durumBadge = '<span class="badge bg-danger">Gecikmiş!</span>';
        } else if (iadeTarihi === bugün) {
            durumBadge = '<span class="badge bg-warning text-dark">Bugün</span>';
        } else {
            durumBadge = '<span class="badge bg-success">Süresi Var</span>';
        }

        const satir = document.createElement("tr");
        satir.innerHTML = `
            <td>${kayit.uye}</td>
            <td>${kayit.kitapAd}</td>
            <td>${kayit.tarih ? kayit.tarih.split('-').reverse().join('.') : "Tarih Yok"}</td>
            <td>${durumBadge}</td>
            <td>
                <button class="btn btn-sm btn-outline-dark" onclick="oduncSil(${kayit.id})">İade Al</button>
            </td>
        `;
        tbody.appendChild(satir);
    });
}
    // İade al (Silme) Fonksiyonu
    function oduncSil(id) {
    oduncler = oduncler.filter(item => item.id !== id);
    localStorage.setItem("oduncler", JSON.stringify(oduncler));
    tabloyuGuncelle2();
    romanTablosuGuncelle();
    polisiyeTablosuGuncelle();
    tarihTablosuGuncelle();
}
//---------------------------------------------------------------------------------------//

function romanTablosuGuncelle() {
    const tbody = document.getElementById("romanTabloGovdesi");
    if (!tbody) return;

    tbody.innerHTML = ""; // Önce tabloyu temizle

    kitaplar.forEach((kitap) => {
        const satir = document.createElement("tr"); //Her kitap için satır yarattırdığımız kısım.
        let kategoriAdi="Roman";

        // Eğer bu kitap 'oduncler' listesinde varsa (kitapAdına göre kontrol), bu adımı atla
        const oduncVerildiMi = oduncler.some(o => o.kitapAd === kitap.ad);
        if (oduncVerildiMi) return; // Eğer ödünçteyse fonksiyondan çık, sonraki kitaba geç
        // -----------------------------


        satir.innerHTML = `
            <td>${kitap.isbn || "---"}</td>
            <td>${kitap.ad}</td>
            <td>${kitap.yazar}</td>
            <td>${kategoriAdi}</td>
        `;
        if(kitap.kategori==1){
            
            
            tbody.appendChild(satir); //tbody'yi parent yaptık ve ona "satir"ı yani child ı ekle dedik.
        }
        
    });
}

function polisiyeTablosuGuncelle() {
    const tbody = document.getElementById("polisiyeTabloGovdesi");
    if (!tbody) return;

    tbody.innerHTML = ""; // Önce tabloyu temizle

    kitaplar.forEach((kitap) => {
        const satir = document.createElement("tr"); //Her kitap için satır yarattırdığımız kısım.
        let kategoriAdi="Polisiye";

        // Eğer bu kitap 'oduncler' listesinde varsa (kitapAdına göre kontrol), bu adımı atla
        const oduncVerildiMi = oduncler.some(o => o.kitapAd === kitap.ad);
        if (oduncVerildiMi) return; // Eğer ödünçteyse fonksiyondan çık, sonraki kitaba geç
        // -----------------------------
        satir.innerHTML = `
            <td>${kitap.isbn || "---"}</td>
            <td>${kitap.ad}</td>
            <td>${kitap.yazar}</td>
            <td>${kategoriAdi}</td>
        `;
        if(kitap.kategori==2){
            tbody.appendChild(satir); //tbody'yi parent yaptık ve ona "satir"ı yani child ı ekle dedik.
        }
        
    });
}

function tarihTablosuGuncelle() {
    const tbody = document.getElementById("tarihTabloGovdesi");
    if (!tbody) return;

    tbody.innerHTML = ""; // Önce tabloyu temizle

    kitaplar.forEach((kitap) => {
        const satir = document.createElement("tr"); //Her kitap için satır yarattırdığımız kısım.
        let kategoriAdi="Tarih";

        // Eğer bu kitap 'oduncler' listesinde varsa (kitapAdına göre kontrol), bu adımı atla
        const oduncVerildiMi = oduncler.some(o => o.kitapAd === kitap.ad);
        if (oduncVerildiMi) return; // Eğer ödünçteyse fonksiyondan çık, sonraki kitaba geç
        // -----------------------------

        satir.innerHTML = `
            <td>${kitap.isbn || "---"}</td>
            <td>${kitap.ad}</td>
            <td>${kitap.yazar}</td>
            <td>${kategoriAdi}</td>
        `;
        if(kitap.kategori==3){
            tbody.appendChild(satir); //tbody'yi parent yaptık ve ona "satir"ı yani child ı ekle dedik.
        }
        
    });
}

function envanterGuncelle(){
    const sumKitap=document.getElementById("toplamKitap");
    const sumOdunc=document.getElementById("oduncKitap");

    if(sumKitap&&sumOdunc){
        const toplam= kitaplar.length;
        const oduncSayisi = oduncler.length;

        const mevcut = toplam-oduncSayisi;

        sumKitap.textContent=mevcut;
        sumOdunc.textContent=oduncSayisi;
    }
}














