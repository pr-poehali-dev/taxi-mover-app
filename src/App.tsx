import { useState } from "react";
import Icon from "@/components/ui/icon";

type Role = "passenger" | "driver" | "admin" | null;
type Screen = "login" | "dashboard" | "booking" | "tracking" | "history" | "support" | "profile";

interface Trip {
  id: string;
  from: string;
  to: string;
  date: string;
  price: number;
  status: "completed" | "cancelled" | "active";
  driver: string;
  rating?: number;
}

const MOCK_TRIPS: Trip[] = [
  { id: "1", from: "ул. Ленина, 12", to: "Аэропорт Домодедово", date: "03 мая, 14:30", price: 1240, status: "completed", driver: "Алексей К.", rating: 5 },
  { id: "2", from: "Парк Победы", to: "ул. Тверская, 8", date: "01 мая, 09:15", price: 380, status: "completed", driver: "Михаил Р.", rating: 4 },
  { id: "3", from: "Офис на Арбате", to: "Сити, башня Федерация", date: "28 апр, 18:00", price: 560, status: "cancelled", driver: "-" },
  { id: "4", from: "ТЦ Мега", to: "Домой", date: "25 апр, 20:45", price: 720, status: "completed", driver: "Дмитрий В.", rating: 5 },
];

const SUPPORT_TICKETS_INIT = [
  { id: "SUP-1042", issue: "Водитель не приехал", date: "02 мая", status: "resolved", answer: "Средства возвращены на баланс." },
  { id: "SUP-1031", issue: "Завышена стоимость поездки", date: "28 апр", status: "open", answer: null as string | null },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [role, setRole] = useState<Role>(null);
  const [ratingTrip, setRatingTrip] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [bookingStep, setBookingStep] = useState(1);
  const [fromAddr, setFromAddr] = useState("");
  const [toAddr, setToAddr] = useState("");
  const [supportMsg, setSupportMsg] = useState("");
  const [tickets, setTickets] = useState(SUPPORT_TICKETS_INIT);
  const [newTicket, setNewTicket] = useState(false);
  const [trips] = useState<Trip[]>(MOCK_TRIPS);
  const [driverStatus, setDriverStatus] = useState<"offline" | "online" | "on_trip">("offline");

  const go = (s: Screen) => setScreen(s);

  function LoginScreen() {
    return (
      <div className="mesh-bg min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background orbs */}
        <div className="fixed top-[-15%] left-[-10%] w-[550px] h-[550px] rounded-full bg-red-900/10 blur-[130px] pointer-events-none" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[450px] h-[450px] rounded-full bg-red-800/8 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-sm animate-fade-in flex flex-col items-center">

          {/* 3D Car image */}
          <div className="animate-car-enter mb-2 relative">
            <img
              src="https://cdn.poehali.dev/projects/bd3aeda5-3e58-49b5-96d7-2a3d6b70c014/files/531d884d-8778-40c1-aeca-8ba4061b907c.jpg"
              alt="Движун"
              className="w-52 h-52 object-contain animate-float drop-shadow-2xl"
              style={{ filter: "drop-shadow(0 0 30px rgba(178,34,34,0.55))" }}
            />
          </div>

          {/* Checkered stripe */}
          <div className="checkered-stripe w-48 rounded-full mb-5 opacity-60" />

          {/* Logo text */}
          <div className="text-center mb-8">
            <h1 className="font-display text-6xl font-bold tracking-widest" style={{
              background: "linear-gradient(135deg, #DC143C 0%, #8B1A1A 60%, #C9A84C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
              letterSpacing: "0.12em"
            }}>
              ДВИЖУН
            </h1>
            <p className="text-muted-foreground text-sm mt-2 tracking-wide">Ваше такси всегда рядом</p>

            {/* E2E badge */}
            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full e2e-badge text-xs">
              <Icon name="Lock" size={10} />
              End-to-end шифрование
            </div>
          </div>

          {/* Main buttons */}
          <div className="w-full space-y-3 mb-6">
            <button
              onClick={() => { setRole("passenger"); go("dashboard"); }}
              className="w-full btn-main rounded-2xl py-5 flex items-center justify-center gap-3 text-xl font-display tracking-wide"
            >
              <Icon name="User" size={26} className="text-white" />
              Я пассажир
            </button>

            <button
              onClick={() => { setRole("driver"); go("dashboard"); }}
              className="w-full rounded-2xl py-5 flex items-center justify-center gap-3 text-xl font-display tracking-wide font-bold text-white transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1.5px solid rgba(178,34,34,0.45)",
                boxShadow: "0 0 20px rgba(139,26,26,0.2)"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(178,34,34,0.12)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(178,34,34,0.7)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(178,34,34,0.45)"; }}
            >
              <Icon name="Car" size={26} className="text-red-400" />
              Я водитель
            </button>
          </div>

          {/* Admin link — subtle */}
          <button
            onClick={() => { setRole("admin"); go("dashboard"); }}
            className="text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors mb-6"
          >
            Вход для администраторов
          </button>

          {/* Privacy policy */}
          <p className="text-center text-xs text-muted-foreground/35 leading-relaxed px-4">
            Нажимая «Я пассажир» или «Я водитель», вы соглашаетесь с{" "}
            <button className="underline hover:text-muted-foreground/60 transition-colors">
              Политикой конфиденциальности
            </button>{" "}
            и{" "}
            <button className="underline hover:text-muted-foreground/60 transition-colors">
              Условиями использования
            </button>
          </p>
        </div>
      </div>
    );
  }

  function Navbar() {
    const roleIcon = role === "passenger" ? "User" : role === "driver" ? "Car" : "Shield";
    const roleLabel = role === "passenger" ? "Пассажир" : role === "driver" ? "Водитель" : "Администратор";
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden border border-red-900/40">
              <img src="https://cdn.poehali.dev/projects/bd3aeda5-3e58-49b5-96d7-2a3d6b70c014/files/531d884d-8778-40c1-aeca-8ba4061b907c.jpg" alt="" className="w-full h-full object-cover scale-125" />
            </div>
            <span className="font-display text-xl font-bold tracking-widest" style={{
              background: "linear-gradient(135deg, #DC143C 0%, #C9A84C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>ДВИЖУН</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs font-medium text-red-400 border border-red-800/40">
              <Icon name={roleIcon as string} size={12} />
              {roleLabel}
            </div>
            <button onClick={() => { setRole(null); go("login"); }} className="w-8 h-8 rounded-xl glass flex items-center justify-center hover:border-red-500/30 transition-all">
              <Icon name="LogOut" size={14} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </nav>
    );
  }

  function BottomNav() {
    const items = role === "passenger"
      ? [
          { icon: "Home", label: "Главная", sc: "dashboard" },
          { icon: "MapPin", label: "Поездка", sc: "booking" },
          { icon: "Clock", label: "История", sc: "history" },
          { icon: "Headphones", label: "Поддержка", sc: "support" },
          { icon: "UserCircle", label: "Профиль", sc: "profile" },
        ]
      : role === "driver"
      ? [
          { icon: "Home", label: "Главная", sc: "dashboard" },
          { icon: "Navigation", label: "Маршруты", sc: "tracking" },
          { icon: "Clock", label: "История", sc: "history" },
          { icon: "Headphones", label: "Поддержка", sc: "support" },
          { icon: "UserCircle", label: "Профиль", sc: "profile" },
        ]
      : [
          { icon: "LayoutDashboard", label: "Обзор", sc: "dashboard" },
          { icon: "Car", label: "Водители", sc: "tracking" },
          { icon: "Clock", label: "Поездки", sc: "history" },
          { icon: "Headphones", label: "Тикеты", sc: "support" },
          { icon: "UserCircle", label: "Настройки", sc: "profile" },
        ];
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-white/5">
        <div className="max-w-2xl mx-auto px-2 h-16 flex items-center justify-around">
          {items.map((item) => {
            const active = screen === item.sc;
            return (
              <button key={item.sc} onClick={() => go(item.sc as Screen)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${active ? "text-red-400" : "text-muted-foreground hover:text-white"}`}
              >
                <Icon name={item.icon as string} size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  function PassengerDashboard() {
    return (
      <div className="space-y-4">
        <div className="glass rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-900/5 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-muted-foreground text-sm mb-1">Добро пожаловать 👋</p>
            <h1 className="font-display text-3xl font-bold text-white tracking-wide">Алексей Смирнов</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => <Icon key={s} name="Star" size={12} className="text-amber-400 fill-amber-400" />)}
              </div>
              <span className="text-amber-400 text-sm font-semibold">4.9</span>
              <span className="text-muted-foreground text-xs">• 23 поездки</span>
            </div>
          </div>
        </div>

        <button onClick={() => go("booking")} className="w-full btn-main rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center">
            <Icon name="MapPin" size={22} className="text-white" />
          </div>
          <div className="text-left">
            <div className="font-bold text-lg text-white">Заказать поездку</div>
            <div className="text-red-100/60 text-sm">Куда едем?</div>
          </div>
          <Icon name="ArrowRight" size={20} className="ml-auto text-white" />
        </button>

        <div className="glass rounded-3xl p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Icon name="Heart" size={16} className="text-red-400" />
            Сохранённые места
          </h3>
          <div className="space-y-3">
            {[
              { icon: "Home", label: "Домой", addr: "ул. Садовая, 14, кв. 7", color: "cyan" },
              { icon: "Briefcase", label: "Работа", addr: "Пресненская наб., 12 (Сити)", color: "purple" },
              { icon: "Star", label: "Спортзал", addr: "Варшавское ш., 87", color: "green" },
            ].map((place) => (
              <button key={place.label} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${place.color === "cyan" ? "bg-red-900/20" : place.color === "purple" ? "bg-red-900/15" : "bg-emerald-500/15"}`}>
                  <Icon name={place.icon as string} size={16} className={place.color === "cyan" ? "text-red-400" : place.color === "purple" ? "text-red-300" : "text-emerald-400"} />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{place.label}</div>
                  <div className="text-muted-foreground text-xs">{place.addr}</div>
                </div>
                <Icon name="ChevronRight" size={14} className="text-muted-foreground ml-auto" />
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Icon name="Clock" size={16} className="text-red-400" />
            Последняя поездка
          </h3>
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center gap-1 mt-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-0.5 h-8 bg-border" />
              <div className="w-2 h-2 rounded-full bg-red-700" />
            </div>
            <div className="flex-1">
              <div className="text-white text-sm font-medium">{trips[0].from}</div>
              <div className="text-muted-foreground text-xs mb-2">{trips[0].date}</div>
              <div className="text-white text-sm font-medium">{trips[0].to}</div>
            </div>
            <div className="text-right">
              <div className="text-red-400 font-bold">{trips[0].price} ₽</div>
              <button onClick={() => go("history")} className="text-xs text-muted-foreground hover:text-white transition-colors">Детали →</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function DriverDashboard() {
    const statusConfig = {
      offline: { label: "Не в сети", bg: "bg-gray-500/15", dot: "bg-gray-400", color: "text-gray-400" },
      online: { label: "Онлайн", bg: "bg-emerald-500/15", dot: "bg-emerald-400", color: "text-emerald-400" },
      on_trip: { label: "В поездке", bg: "bg-red-900/20", dot: "bg-red-500", color: "text-red-400" },
    };
    const s = statusConfig[driverStatus];
    return (
      <div className="space-y-4">
        <div className="glass rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-900/5 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-muted-foreground text-sm mb-1">Водитель</p>
            <h1 className="font-display text-3xl font-bold text-white tracking-wide">Иван Петров</h1>
            <div className="flex items-center gap-3 mt-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${s.bg}`}>
                <div className={`w-2 h-2 rounded-full ${s.dot} ${driverStatus === "online" ? "animate-pulse" : ""}`} />
                <span className={`text-sm font-medium ${s.color}`}>{s.label}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <p className="text-muted-foreground text-xs mb-3">Изменить статус</p>
          <div className="flex gap-2">
            {(["offline","online","on_trip"] as const).map((st) => (
              <button key={st} onClick={() => setDriverStatus(st)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                  driverStatus === st
                    ? st === "online" ? "bg-emerald-500 text-white" : st === "on_trip" ? "bg-red-700 text-white" : "bg-gray-600 text-white"
                    : "glass text-muted-foreground hover:text-white"
                }`}
              >
                {st === "offline" ? "Оффлайн" : st === "online" ? "Онлайн" : "В поездке"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Сегодня", value: "3 420 ₽", icon: "TrendingUp", color: "text-emerald-400" },
            { label: "Поездки", value: "8", icon: "Route", color: "text-red-400" },
            { label: "Рейтинг", value: "4.8 ★", icon: "Star", color: "text-amber-400" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-3 text-center">
              <Icon name={stat.icon as string} size={18} className={`${stat.color} mx-auto mb-1`} />
              <div className={`font-bold text-sm ${stat.color}`}>{stat.value}</div>
              <div className="text-muted-foreground text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="glass rounded-3xl p-5 border border-red-800/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Новый заказ</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-red-900/20 text-red-400 font-medium animate-pulse-slow">Ожидает ответа</span>
          </div>
          <div className="flex items-start gap-3 mb-4">
            <div className="flex flex-col items-center gap-1 mt-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-0.5 h-8 bg-border" />
              <div className="w-2 h-2 rounded-full bg-red-700" />
            </div>
            <div className="flex-1">
              <div className="text-white text-sm">ул. Арбат, 24</div>
              <div className="text-muted-foreground text-xs mb-2">↓ 3.2 км</div>
              <div className="text-white text-sm">Аэропорт Шереметьево</div>
            </div>
            <div className="text-right">
              <div className="text-red-400 font-bold text-lg">1 840 ₽</div>
              <div className="text-muted-foreground text-xs">~52 мин</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2.5 rounded-xl bg-red-500/15 text-red-400 text-sm font-medium hover:bg-red-500/25 transition-all">Отклонить</button>
            <button className="flex-1 py-2.5 rounded-xl btn-neon text-sm" onClick={() => setDriverStatus("on_trip")}>Принять</button>
          </div>
        </div>
      </div>
    );
  }

  function AdminDashboard() {
    return (
      <div className="space-y-4">
        <div className="glass rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />
          <p className="text-muted-foreground text-sm mb-1 relative">Администратор</p>
          <h1 className="font-display text-3xl font-bold text-white tracking-wide relative">Панель управления</h1>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Поездок сегодня", value: "1 247", change: "+12%", icon: "Route", color: "cyan" },
            { label: "Активных водителей", value: "84", change: "+3", icon: "Car", color: "purple" },
            { label: "Выручка (день)", value: "842 тыс ₽", change: "+8%", icon: "TrendingUp", color: "green" },
            { label: "Открытых тикетов", value: "17", change: "-4", icon: "MessageCircle", color: "amber" },
          ].map((kpi) => (
            <div key={kpi.label} className="glass rounded-2xl p-4 card-hover">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${
                kpi.color === "cyan" ? "bg-red-900/20" : kpi.color === "purple" ? "bg-red-900/15" : kpi.color === "green" ? "bg-emerald-500/15" : "bg-amber-500/15"
              }`}>
                <Icon name={kpi.icon as string} size={16} className={kpi.color === "cyan" ? "text-red-400" : kpi.color === "purple" ? "text-red-300" : kpi.color === "green" ? "text-emerald-400" : "text-amber-400"} />
              </div>
              <div className="text-white font-bold text-xl">{kpi.value}</div>
              <div className="text-muted-foreground text-xs mb-1">{kpi.label}</div>
              <div className={`text-xs font-medium ${kpi.change.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>{kpi.change} за 24ч</div>
            </div>
          ))}
        </div>

        <div className="glass rounded-3xl p-5 relative overflow-hidden" style={{minHeight: 180}}>
          <div className="absolute inset-0 opacity-20" style={{
            background: `linear-gradient(rgba(178,34,34,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(178,34,34,0.2) 1px, transparent 1px)`,
            backgroundSize: "40px 40px"
          }} />
          <div className="relative">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Icon name="Map" size={16} className="text-red-400" />
              Карта в реальном времени
            </h3>
            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">84 водителя онлайн</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-700" />
                <span className="text-xs text-muted-foreground">23 в поездке</span>
              </div>
            </div>
            {[[25,30],[40,60],[60,40],[75,70],[50,80],[35,50],[65,25],[80,45]].map(([x,y],i) => (
              <div key={i} className="absolute w-3 h-3 rounded-full border-2 border-gray-900" style={{
                left: `${x}%`, top: `${y + 20}%`,
                background: i < 5 ? "#B22222" : "#8B1A1A",
                boxShadow: i < 5 ? "0 0 8px rgba(178,34,34,0.9)" : "0 0 8px rgba(139,26,26,0.9)"
              }} />
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Icon name="Users" size={16} className="text-red-300" />
            Топ водители сегодня
          </h3>
          <div className="space-y-3">
            {[
              { name: "Алексей К.", trips: 14, rating: 4.9, earnings: "18 200 ₽" },
              { name: "Михаил Р.", trips: 11, rating: 4.8, earnings: "14 800 ₽" },
              { name: "Дмитрий В.", trips: 9, rating: 5.0, earnings: "12 100 ₽" },
            ].map((d, i) => (
              <div key={d.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-800/30 to-red-900/30 border border-red-800/20 flex items-center justify-center text-red-300 font-bold text-sm">{i + 1}</div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{d.name}</div>
                  <div className="text-muted-foreground text-xs">{d.trips} поездок • ★ {d.rating}</div>
                </div>
                <div className="text-emerald-400 font-semibold text-sm">{d.earnings}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function BookingScreen() {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="glass rounded-3xl p-5">
          <h2 className="font-display text-2xl font-bold text-white tracking-wide mb-1">Заказ поездки</h2>
          <p className="text-muted-foreground text-sm">Укажите маршрут</p>
        </div>

        {bookingStep === 1 && (
          <div className="glass rounded-3xl p-5 space-y-4 animate-slide-up">
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-500" />
                <input className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-red-700/50 transition-all"
                  placeholder="Откуда едем?" value={fromAddr} onChange={e => setFromAddr(e.target.value)} />
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-700" />
                <input className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-red-700/50 transition-all"
                  placeholder="Куда едем?" value={toAddr} onChange={e => setToAddr(e.target.value)} />
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-3">Выберите тариф</p>
              <div className="space-y-2">
                {[
                  { name: "Эконом", time: "5 мин", price: "от 280 ₽", icon: "Car", active: true },
                  { name: "Комфорт", time: "3 мин", price: "от 480 ₽", icon: "Car", active: false },
                  { name: "Бизнес", time: "8 мин", price: "от 890 ₽", icon: "Star", active: false },
                ].map((t) => (
                  <button key={t.name} className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${t.active ? "border-red-700/40 bg-red-900/5" : "border-white/10 hover:border-white/20 bg-white/5"}`}>
                    <Icon name={t.icon as string} size={18} className={t.active ? "text-red-400" : "text-muted-foreground"} />
                    <div className="flex-1 text-left">
                      <div className={`text-sm font-medium ${t.active ? "text-red-400" : "text-white"}`}>{t.name}</div>
                      <div className="text-muted-foreground text-xs">{t.time} • {t.price}</div>
                    </div>
                    {t.active && <Icon name="Check" size={14} className="text-red-400" />}
                  </button>
                ))}
              </div>
            </div>
            <button className="w-full btn-neon rounded-xl py-3 font-semibold" onClick={() => setBookingStep(2)}>Найти водителя</button>
          </div>
        )}

        {bookingStep === 2 && (
          <div className="glass rounded-3xl p-5 space-y-4 animate-slide-up">
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-red-900/20 border border-red-800/40 flex items-center justify-center mx-auto mb-3 animate-pulse-slow">
                <Icon name="Search" size={28} className="text-red-400" />
              </div>
              <p className="text-white font-semibold">Ищем водителя...</p>
              <p className="text-muted-foreground text-sm mt-1">Обычно 1-3 минуты</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 glass rounded-xl p-3 text-center">
                <div className="text-red-400 font-bold text-lg">3</div>
                <div className="text-muted-foreground text-xs">мин. ожидания</div>
              </div>
              <div className="flex-1 glass rounded-xl p-3 text-center">
                <div className="text-red-300 font-bold text-lg">480 ₽</div>
                <div className="text-muted-foreground text-xs">стоимость</div>
              </div>
            </div>
            <button className="w-full btn-neon rounded-xl py-3 font-semibold" onClick={() => { go("tracking"); setBookingStep(1); }}>
              Водитель найден! Отследить →
            </button>
            <button className="w-full py-2 text-muted-foreground text-sm hover:text-white transition-colors" onClick={() => setBookingStep(1)}>Отмена</button>
          </div>
        )}
      </div>
    );
  }

  function TrackingScreen() {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="glass rounded-3xl p-5">
          <h2 className="font-display text-2xl font-bold text-white tracking-wide mb-1">
            {role === "admin" ? "Мониторинг водителей" : "Отслеживание поездки"}
          </h2>
          <p className="text-muted-foreground text-sm">Данные обновляются в реальном времени</p>
        </div>

        <div className="glass rounded-3xl relative overflow-hidden" style={{ height: 280 }}>
          <div className="absolute inset-0" style={{
            background: `linear-gradient(rgba(178,34,34,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(178,34,34,0.08) 1px, transparent 1px), radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,26,26,0.06) 0%, transparent 70%), #110808`,
            backgroundSize: "50px 50px, 50px 50px, 100% 100%, 100% 100%"
          }} />
          <svg className="absolute inset-0 w-full h-full" style={{opacity: 0.6}}>
            <path d="M 80 220 Q 140 160 200 120 T 320 80" stroke="#B22222" strokeWidth="2" fill="none" strokeDasharray="6 4" />
          </svg>
          <div className="absolute" style={{left: "20%", top: "72%"}}>
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg shadow-red-600/60 animate-pulse" />
          </div>
          <div className="absolute animate-float" style={{left: "48%", top: "42%"}}>
            <div className="w-10 h-10 rounded-full bg-gray-900 border-2 border-red-500 flex items-center justify-center shadow-xl shadow-red-600/40">
              <Icon name="Car" size={18} className="text-red-400" />
            </div>
          </div>
          <div className="absolute" style={{left: "78%", top: "20%"}}>
            <div className="w-5 h-5 rounded-full bg-red-700 border-2 border-white shadow-lg shadow-red-700/60" />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-red-300 font-medium">Цель</div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="glass rounded-xl px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white text-sm font-medium">Водитель едет к вам</span>
              </div>
              <span className="text-red-400 font-bold">~4 мин</span>
            </div>
          </div>
        </div>

        {role !== "admin" && (
          <div className="glass rounded-3xl p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-800/30 to-red-900/30 border border-red-800/20 flex items-center justify-center">
              <Icon name="User" size={24} className="text-red-300" />
            </div>
            <div className="flex-1">
              <div className="text-white font-semibold">Алексей Козлов</div>
              <div className="text-muted-foreground text-sm">Toyota Camry • А 123 МО 77</div>
              <div className="flex gap-0.5 mt-1">
                {[1,2,3,4,5].map(s => <Icon key={s} name="Star" size={11} className="text-amber-400 fill-amber-400" />)}
              </div>
            </div>
            <button className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-500/25 transition-all">
              <Icon name="Phone" size={20} className="text-emerald-400" />
            </button>
          </div>
        )}

        <div className="glass rounded-3xl p-5">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center gap-1 mt-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-0.5 h-10 bg-gradient-to-b from-red-500 to-red-600" />
              <div className="w-3 h-3 rounded-full bg-red-700" />
            </div>
            <div className="flex-1">
              <div className="text-white font-medium">ул. Арбат, 24</div>
              <div className="text-muted-foreground text-xs mb-3">Место посадки</div>
              <div className="text-white font-medium">Аэропорт Шереметьево, Т2</div>
              <div className="text-muted-foreground text-xs">Место назначения</div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold">1 840 ₽</div>
              <div className="text-muted-foreground text-xs">~52 мин</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function HistoryScreen() {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="glass rounded-3xl p-5">
          <h2 className="font-display text-2xl font-bold text-white tracking-wide mb-1">История поездок</h2>
          <p className="text-muted-foreground text-sm">{trips.length} поездок всего</p>
        </div>
        <div className="space-y-3">
          {trips.map((trip) => (
            <div key={trip.id} className="glass rounded-2xl p-4 card-hover">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trip.status === "completed" ? "bg-emerald-500/15 text-emerald-400" : trip.status === "active" ? "bg-red-900/20 text-red-400" : "bg-red-500/15 text-red-400"}`}>
                  {trip.status === "completed" ? "Завершена" : trip.status === "active" ? "Активна" : "Отменена"}
                </span>
                <div className="text-right">
                  <div className="text-white font-bold">{trip.price} ₽</div>
                  <div className="text-muted-foreground text-xs">{trip.date}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex flex-col items-center gap-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-0.5 h-6 bg-border" />
                  <div className="w-2 h-2 rounded-full bg-red-700" />
                </div>
                <div>
                  <div className="text-white text-sm">{trip.from}</div>
                  <div className="text-white text-sm mt-1">{trip.to}</div>
                </div>
              </div>
              {trip.status === "completed" && (
                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <div className="text-muted-foreground text-xs">Водитель: {trip.driver}</div>
                  {ratingTrip === trip.id ? (
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} onClick={() => { setRatings(r => ({...r, [trip.id]: s})); setRatingTrip(null); }}>
                          <Icon name="Star" size={16} className={`${(ratings[trip.id] || 0) >= s ? "text-amber-400 fill-amber-400" : "text-muted-foreground"} transition-colors`} />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button onClick={() => setRatingTrip(trip.id)} className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                      {[1,2,3,4,5].map(s => (
                        <Icon key={s} name="Star" size={12} className={`${(ratings[trip.id] || (trip.rating || 0)) >= s ? "fill-amber-400" : ""} text-amber-400`} />
                      ))}
                      <span className="ml-1">{ratings[trip.id] || trip.rating}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function SupportScreen() {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="glass rounded-3xl p-5">
          <h2 className="font-display text-2xl font-bold text-white tracking-wide mb-1">Служба поддержки</h2>
          <p className="text-muted-foreground text-sm">Решаем проблемы быстро</p>
        </div>
        <div className="glass rounded-3xl p-5">
          <h3 className="text-white font-semibold mb-3 text-sm">Частые вопросы</h3>
          <div className="space-y-2">
            {[
              { q: "Как отменить поездку?", icon: "X" },
              { q: "Не пришёл чек за поездку", icon: "Receipt" },
              { q: "Водитель не приехал", icon: "AlertCircle" },
              { q: "Проблема с оплатой", icon: "CreditCard" },
            ].map((faq) => (
              <button key={faq.q} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left">
                <Icon name={faq.icon as string} size={16} className="text-muted-foreground" />
                <span className="text-white text-sm">{faq.q}</span>
                <Icon name="ChevronRight" size={14} className="text-muted-foreground ml-auto" />
              </button>
            ))}
          </div>
        </div>
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Мои обращения</h3>
            <button onClick={() => setNewTicket(true)} className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
              <Icon name="Plus" size={12} /> Новое
            </button>
          </div>
          {newTicket && (
            <div className="mb-4 space-y-2 animate-slide-up">
              <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-muted-foreground text-sm focus:outline-none focus:border-red-700/50 resize-none"
                rows={3} placeholder="Опишите проблему..." value={supportMsg} onChange={e => setSupportMsg(e.target.value)} />
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-xl bg-white/5 text-muted-foreground text-sm hover:text-white transition-all"
                  onClick={() => { setNewTicket(false); setSupportMsg(""); }}>Отмена</button>
                <button className="flex-1 btn-neon rounded-xl py-2 text-sm font-semibold"
                  onClick={() => {
                    if (supportMsg.trim()) {
                      setTickets(t => [{ id: `SUP-${1050 + t.length}`, issue: supportMsg, date: "4 мая", status: "open", answer: null }, ...t]);
                      setSupportMsg(""); setNewTicket(false);
                    }
                  }}>Отправить</button>
              </div>
            </div>
          )}
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="border border-white/8 rounded-xl p-3">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-muted-foreground text-xs font-mono">{ticket.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ticket.status === "resolved" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                    {ticket.status === "resolved" ? "Решено" : "Открыто"}
                  </span>
                </div>
                <div className="text-white text-sm">{ticket.issue}</div>
                <div className="text-muted-foreground text-xs mt-1">{ticket.date}</div>
                {ticket.answer && (
                  <div className="mt-2 p-2 rounded-lg bg-emerald-500/8 border border-emerald-500/20">
                    <p className="text-emerald-400 text-xs">{ticket.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <button className="w-full btn-purple rounded-2xl py-4 flex items-center justify-center gap-2 font-semibold">
          <Icon name="MessageCircle" size={20} />
          Написать в чат поддержки
        </button>
      </div>
    );
  }

  function ProfileScreen() {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="glass rounded-3xl p-6 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-red-900/10 to-transparent" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center mb-4 shadow-2xl shadow-red-700/30">
            <Icon name="User" size={36} className="text-white" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-gray-900" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white tracking-wide">
            {role === "passenger" ? "Алексей Смирнов" : role === "driver" ? "Иван Петров" : "Администратор"}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {role === "passenger" ? "+7 (999) 123-45-67" : role === "driver" ? "+7 (999) 765-43-21" : "admin@ridex.app"}
          </p>
          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <div className="text-white font-bold text-xl">{role === "driver" ? "156" : "23"}</div>
              <div className="text-muted-foreground text-xs">Поездок</div>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <div className="text-amber-400 font-bold text-xl">{role === "driver" ? "4.8" : "4.9"} ★</div>
              <div className="text-muted-foreground text-xs">Рейтинг</div>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <div className="text-emerald-400 font-bold text-xl">{role === "driver" ? "2.1 г." : "1 г."}</div>
              <div className="text-muted-foreground text-xs">С нами</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-3xl p-4">
          <div className="space-y-1">
            {[
              { icon: "User", label: "Личные данные", sub: "Имя, телефон, email" },
              { icon: "CreditCard", label: "Способы оплаты", sub: "Карты и баланс" },
              { icon: "Bell", label: "Уведомления", sub: "Push, SMS, Email" },
              { icon: "Shield", label: "Безопасность", sub: "Пароль, 2FA" },
              { icon: "MapPin", label: "Сохранённые места", sub: "Дом, Работа и другие" },
            ].map((item) => (
              <button key={item.label} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left">
                <div className="w-9 h-9 rounded-xl glass flex items-center justify-center">
                  <Icon name={item.icon as string} size={16} className="text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{item.label}</div>
                  <div className="text-muted-foreground text-xs">{item.sub}</div>
                </div>
                <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => { setRole(null); go("login"); }}
          className="w-full py-3 rounded-2xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-medium flex items-center justify-center gap-2">
          <Icon name="LogOut" size={16} />
          Выйти из аккаунта
        </button>
      </div>
    );
  }

  if (screen === "login") return <LoginScreen />;

  return (
    <div className="mesh-bg min-h-screen">
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-red-900/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-red-900/5 blur-[120px] pointer-events-none" />
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 pt-20 pb-24">
        {screen === "dashboard" && role === "passenger" && <PassengerDashboard />}
        {screen === "dashboard" && role === "driver" && <DriverDashboard />}
        {screen === "dashboard" && role === "admin" && <AdminDashboard />}
        {screen === "booking" && <BookingScreen />}
        {screen === "tracking" && <TrackingScreen />}
        {screen === "history" && <HistoryScreen />}
        {screen === "support" && <SupportScreen />}
        {screen === "profile" && <ProfileScreen />}
      </main>
      <BottomNav />
    </div>
  );
}