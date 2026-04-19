import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield, Award, Users, MapPin, Phone, ArrowRight, CheckCircle2, Star, Clock, Wrench, Building2, Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımızda | Best Kapı - Adana Çelik Kapı",
  description:
    "Best Kapı, Best Pen güvencesiyle Adana ve çevre illerde çelik kapı satış ve montaj hizmeti vermektedir. Yılların tecrübesi, TSE belgeli üretim ve profesyonel montaj.",
  keywords:
    "best kapı hakkında, adana çelik kapı firması, best pen, adana güvenlik kapısı, çelik kapı adana",
};

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #161616 50%, #0A0A0A 100%)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,165,92,0.1)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(200,165,92,0.05)_0%,transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(200,165,92,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(200,165,92,0.2) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute top-10 right-[20%] w-32 h-32 rounded-full blur-3xl animate-float" style={{ background: 'rgba(200, 165, 92, 0.08)' }} />

        <div className="container-custom relative z-10 text-white" style={{ padding: '48px 24px 56px' }}>
          <span className="badge-gold" style={{ marginBottom: '20px', display: 'inline-flex' }}>
            <Building2 className="w-3.5 h-3.5" />
            Hakkımızda
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-extrabold leading-tight max-w-3xl" style={{ lineHeight: '1.1' }}>
            Adana&apos;da Çelik Kapının <span className="text-gold">Güvenilir Adresi</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-2xl text-base md:text-lg leading-relaxed" style={{ marginTop: '16px' }}>
            Best Kapı, Best Pen firmasının alt markası olarak Adana ve çevre illerde çelik kapı sektöründe hizmet vermektedir. Güvenliğiniz bizim önceliğimiz.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div className="container-custom" style={{ padding: '40px 24px' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "150+", label: "Kapı Modeli", icon: Shield },
              { value: "20+ Yıl", label: "Sektör Tecrübesi", icon: Award },
              { value: "4.9/5", label: "Müşteri Memnuniyeti", icon: Star },
              { value: "7/24", label: "Servis Desteği", icon: Clock },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div
                  className="flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110"
                  style={{
                    width: '56px', height: '56px', borderRadius: '16px',
                    background: 'rgba(200, 165, 92, 0.08)',
                    border: '1px solid rgba(200, 165, 92, 0.12)',
                    marginBottom: '12px',
                  }}
                >
                  <stat.icon className="w-6 h-6 text-[var(--gold)]" />
                </div>
                <div className="text-gold font-serif text-2xl md:text-3xl font-extrabold">{stat.value}</div>
                <div className="text-xs text-[var(--text-muted)]" style={{ marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: '64px 0 80px', background: 'var(--bg-primary)' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-gold" style={{ marginBottom: '16px', display: 'inline-flex' }}>
                <Sparkles className="w-3 h-3" /> Hikayemiz
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]" style={{ marginTop: '12px' }}>
                Best Pen Güvencesiyle <span className="text-gold">Best Kapı</span>
              </h2>
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="text-[var(--text-secondary)] leading-relaxed">
                <p>
                  Best Pen firmasının güçlü altyapısı ve uzun yıllara dayanan tecrübesi ile kurulan Best Kapı, Adana ve çevre illerde çelik kapı sektöründe kalite ve güvenin adresi olmayı hedeflemektedir.
                </p>
                <p>
                  Adana&apos;nın iklim koşullarına uygun, yüksek ısı yalıtımlı ve dayanıklı çelik kapı modellerimiz ile evinizin güvenliğini en üst seviyeye taşıyoruz. TSE, CE ve ISO 9001 belgelerimiz ile kalite standartlarımızı belgeleyen bir firma olarak, her kapıda aynı titizliği gösteriyoruz.
                </p>
                <p>
                  Profesyonel montaj ekibimiz, satış sonrası servis ve garanti hizmetlerimiz ile müşterilerimizin yanında olmaya devam ediyoruz. Adana merkez, Mersin, Hatay, Osmaniye ve çevre illere hizmet ağımızı genişleterek bölgenin en güvenilir çelik kapı markası olma yolunda ilerliyoruz.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: "TSE Belgeli Üretim", desc: "Tüm kapılarımız TSE standartlarına uygun olarak üretilmektedir." },
                { title: "Profesyonel Montaj Ekibi", desc: "Deneyimli montaj ekibimiz ile kapınız kusursuz bir şekilde takılır." },
                { title: "Satış Sonrası Destek", desc: "7/24 servis desteği ve 20 yıla kadar garanti ile her zaman yanınızdayız." },
                { title: "Geniş Ürün Yelpazesi", desc: "150'den fazla model ile her bütçeye ve zevke uygun çelik kapı seçenekleri." },
                { title: "Bölgesel Güç", desc: "Adana, Mersin, Hatay ve Osmaniye'de güçlü hizmet ağı." },
              ].map((item) => (
                <div key={item.title} className="card-gold" style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '10px',
                    background: 'rgba(200, 165, 92, 0.08)',
                    border: '1px solid rgba(200, 165, 92, 0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: '2px',
                  }}>
                    <CheckCircle2 className="w-4 h-4 text-[var(--gold)]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[var(--text-primary)]" style={{ marginBottom: '4px' }}>{item.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section style={{ padding: '64px 0 80px', background: 'var(--bg-secondary)' }}>
        <div className="container-custom">
          <div className="text-center" style={{ marginBottom: '48px' }}>
            <span className="badge-gold" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              <MapPin className="w-3 h-3" /> Hizmet Bölgelerimiz
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]" style={{ marginTop: '12px' }}>
              Adana ve <span className="text-gold">Çevre İller</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto" style={{ marginTop: '12px' }}>
              Profesyonel ekibimiz ile aşağıdaki bölgelere çelik kapı satış, montaj ve servis hizmeti veriyoruz.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { city: "Adana Merkez", detail: "Seyhan, Çukurova, Yüreğir, Sarıçam" },
              { city: "Mersin", detail: "Yenişehir, Toroslar, Mezitli" },
              { city: "Hatay", detail: "Antakya, İskenderun, Defne" },
              { city: "Osmaniye", detail: "Merkez, Kadirli, Düziçi" },
              { city: "Tarsus", detail: "Mersin / Tarsus" },
              { city: "Ceyhan", detail: "Adana / Ceyhan" },
            ].map((area) => (
              <div key={area.city} className="card-gold text-center" style={{ padding: '24px 16px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: 'rgba(200, 165, 92, 0.08)',
                  border: '1px solid rgba(200, 165, 92, 0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                }}>
                  <MapPin className="w-[18px] h-[18px] text-[var(--gold)]" />
                </div>
                <h3 className="font-serif text-sm font-bold text-[var(--text-primary)]" style={{ marginBottom: '4px' }}>{area.city}</h3>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{area.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '64px 0 80px', background: 'var(--bg-primary)' }}>
        <div className="container-custom">
          <div className="text-center" style={{ marginBottom: '48px' }}>
            <span className="badge-gold" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              <Award className="w-3 h-3" /> Değerlerimiz
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]" style={{ marginTop: '12px' }}>
              Neden <span className="text-gold">Best Kapı?</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: "Güvenlik Öncelikli", desc: "Her kapıda TSE onaylı kilit sistemleri ve dayanıklı çelik yapı kullanıyoruz." },
              { icon: Users, title: "Müşteri Odaklı", desc: "Müşteri memnuniyeti bizim için en önemli başarı ölçütüdür. Her adımda yanınızdayız." },
              { icon: Award, title: "Kalite Standardı", desc: "TSE, CE ve ISO 9001 belgeleri ile kaliteden asla ödün vermiyoruz." },
              { icon: Wrench, title: "Uzman Kadro", desc: "Deneyimli montaj ve servis ekibimiz ile kusursuz hizmet sunuyoruz." },
              { icon: Clock, title: "Hızlı Teslimat", desc: "Adana ve çevresinde hızlı teslimat ve montaj hizmeti sağlıyoruz." },
              { icon: Star, title: "Müşteri Güveni", desc: "Yüzlerce mutlu müşteri ve Google'da 4.9/5 puan ile güveninizi kazanıyoruz." },
            ].map((value) => (
              <div key={value.title} className="card-gold group" style={{ padding: '28px' }}>
                <div
                  className="transition-all duration-300 group-hover:scale-110"
                  style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: 'rgba(200, 165, 92, 0.08)',
                    border: '1px solid rgba(200, 165, 92, 0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <value.icon className="w-[22px] h-[22px] text-[var(--gold)]" />
                </div>
                <h3 className="font-serif text-base font-bold text-[var(--text-primary)]" style={{ marginBottom: '8px' }}>{value.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #161616 50%, #0A0A0A 100%)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,165,92,0.1)_0%,transparent_70%)]" />
        <div className="container-custom text-center relative z-10" style={{ padding: '56px 24px' }}>
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-white" style={{ marginBottom: '16px' }}>
            Adana&apos;da Çelik Kapı İhtiyacınız mı Var?
          </h2>
          <p className="text-[var(--text-muted)] max-w-lg mx-auto" style={{ marginBottom: '32px' }}>
            Best Kapı olarak size en uygun çelik kapı çözümünü sunmak için hazırız. Hemen iletişime geçin.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3" style={{ maxWidth: '420px', margin: '0 auto' }}>
            <Link href="/iletisim" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-xl transition-colors text-[15px] cta-gold" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--bg-primary)' }}>
              İletişime Geçin <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:+903221234567" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-bold rounded-xl transition-colors text-[15px]" style={{ border: '1px solid var(--border-light)' }}>
              <Phone className="w-4 h-4" /> (0322) 123 45 67
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
