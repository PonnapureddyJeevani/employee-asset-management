import { useMemo, useState } from 'react'
import { 
  LayoutDashboard, Package, ClipboardList, RotateCcw, Plus, Search,
  Laptop, Keyboard, Mouse, BatteryCharging, Bell, UserCircle, X
} from 'lucide-react'

type Asset = {
  id: number
  employeeId: string
  employee: string
  type: string
  assetNo: string
  configuration: string
  date: string
  status: 'Assigned' | 'Pending' | 'Returned'
}

const initialAssets: Asset[] = [
  { id: 1, employeeId: 'EMP1024', employee: 'Ananya Rao', type: 'Laptop', assetNo: 'LAP-1048', configuration: 'i5 / 16GB / 512GB SSD', date: '2026-09-12', status: 'Assigned' },
  { id: 2, employeeId: 'EMP1051', employee: 'Rahul Kumar', type: 'Keyboard', assetNo: 'KEY-2031', configuration: 'Wireless Keyboard', date: '2026-09-14', status: 'Assigned' },
  { id: 3, employeeId: 'EMP1077', employee: 'Priya Sharma', type: 'Mouse', assetNo: 'MOU-3056', configuration: 'Wireless Mouse', date: '2026-09-16', status: 'Pending' },
  { id: 4, employeeId: 'EMP1102', employee: 'Arjun Reddy', type: 'Charger', assetNo: 'CHR-4088', configuration: '65W USB-C', date: '2026-09-18', status: 'Returned' }
]

const icons: Record<string, any> = { Laptop, Keyboard, Mouse, Charger: BatteryCharging }

function App() {
  const [active, setActive] = useState('Dashboard')
  const [assets, setAssets] = useState(initialAssets)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')

  const filtered = useMemo(() => assets.filter(a =>
    `${a.employee} ${a.employeeId} ${a.assetNo} ${a.type}`.toLowerCase().includes(search.toLowerCase())
  ), [assets, search])

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(''), 2500)
  }

  const addAsset = (asset: Asset) => {
    setAssets(prev => [asset, ...prev])
    setShowModal(false)
    showToast('Asset request added successfully')
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Package size={21}/></div>
          <div><strong>AssetFlow</strong><span>Employee Portal</span></div>
        </div>
        <nav>
          <button className={active === 'Dashboard' ? 'nav active' : 'nav'} onClick={() => setActive('Dashboard')}><LayoutDashboard/>Dashboard</button>
          <button className={active === 'Assigned Assets' ? 'nav active' : 'nav'} onClick={() => setActive('Assigned Assets')}><Package/>Assigned Assets</button>
          <button className={active === 'Asset Request' ? 'nav active' : 'nav'} onClick={() => setActive('Asset Request')}><ClipboardList/>Asset Request</button>
          <button className={active === 'Return Status' ? 'nav active' : 'nav'} onClick={() => setActive('Return Status')}><RotateCcw/>Return Status</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="mini-profile"><UserCircle/><div><b>Jeevani</b><span>Employee</span></div></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{active}</h1>
            <p>Manage employee assets efficiently and securely.</p>
          </div>
          <div className="top-actions"><button className="icon-btn"><Bell size={19}/><i/></button><div className="avatar">JR</div></div>
        </header>

        <section className="content">
          {active === 'Dashboard' && <Dashboard assets={assets} onRequest={() => setShowModal(true)} />}
          {active === 'Asset Request' && <RequestPage onRequest={() => setShowModal(true)} />}
          {active === 'Return Status' && <TablePage title="Asset Return Status" assets={assets.filter(a => a.status === 'Returned' || a.status === 'Pending')} search={search} setSearch={setSearch} />}
          {active === 'Assigned Assets' && <TablePage title="Assigned Assets" assets={filtered} search={search} setSearch={setSearch} />}
        </section>
      </main>

      {showModal && <AssetModal onClose={() => setShowModal(false)} onAdd={addAsset} />}
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  )
}

function Dashboard({assets, onRequest}: {assets: Asset[], onRequest:()=>void}) {
  const assigned = assets.filter(a => a.status === 'Assigned').length
  const pending = assets.filter(a => a.status === 'Pending').length
  const returned = assets.filter(a => a.status === 'Returned').length
  return <div>
    <div className="welcome"><div><span className="eyebrow">WELCOME BACK</span><h2>Good evening, Jeevani 👋</h2><p>Here’s an overview of your employee asset management.</p></div><button className="primary" onClick={onRequest}><Plus size={18}/>Request Asset</button></div>
    <div className="stats">
      <Stat label="Total Assets" value={assets.length} icon={<Package/>}/>
      <Stat label="Assigned" value={assigned} icon={<Laptop/>}/>
      <Stat label="Pending Requests" value={pending} icon={<ClipboardList/>}/>
      <Stat label="Returned" value={returned} icon={<RotateCcw/>}/>
    </div>
    <div className="panel">
      <div className="panel-head"><div><h3>Recent Assets</h3><p>Latest asset activity</p></div></div>
      <AssetTable assets={assets.slice(0,4)}/>
    </div>
  </div>
}

function Stat({label,value,icon}:{label:string,value:number,icon:React.ReactNode}) {
  return <div className="stat"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div>
}

function RequestPage({onRequest}:{onRequest:()=>void}) {
  return <div className="empty-request"><div className="request-card"><div className="big-icon"><ClipboardList/></div><h2>Request a New Asset</h2><p>Need a laptop, keyboard, mouse or charger? Submit an asset request with the required details.</p><button className="primary" onClick={onRequest}><Plus size={18}/>Create Asset Request</button></div></div>
}

function TablePage({title,assets,search,setSearch}:{title:string,assets:Asset[],search:string,setSearch:(s:string)=>void}) {
  return <div className="panel"><div className="panel-head"><div><h3>{title}</h3><p>Track and manage asset information</p></div><div className="search"><Search size={17}/><input placeholder="Search employee or asset..." value={search} onChange={e=>setSearch(e.target.value)}/></div></div><AssetTable assets={assets}/></div>
}

function AssetTable({assets}:{assets:Asset[]}) {
  const getIcon = (type:string) => { const C = icons[type] || Package; return <C size={19}/> }
  return <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Asset</th><th>Asset Number</th><th>Configuration</th><th>Date</th><th>Status</th></tr></thead><tbody>
    {assets.map(a=><tr key={a.id}><td><div className="employee"><div className="asset-icon">{getIcon(a.type)}</div><div><b>{a.employee}</b><small>{a.employeeId}</small></div></div></td><td>{a.type}</td><td>{a.assetNo}</td><td>{a.configuration}</td><td>{a.date}</td><td><span className={`badge ${a.status.toLowerCase()}`}>{a.status}</span></td></tr>)}
  </tbody></table></div>
}

function AssetModal({onClose,onAdd}:{onClose:()=>void,onAdd:(a:Asset)=>void}) {
  const [form,setForm] = useState({employeeId:'',employee:'',type:'Laptop',assetNo:'',configuration:'',date:'',allocatedBy:'Jeevani'})
  const [error,setError] = useState('')
  const submit = (e:React.FormEvent) => {
    e.preventDefault()
    if(!form.employeeId || !form.employee || !form.assetNo || !form.configuration || !form.date) { setError('Please fill all required fields.'); return }
    onAdd({id:Date.now(),...form,status:'Pending'})
  }
  return <div className="overlay"><div className="modal"><div className="modal-head"><div><h2>Request Asset</h2><p>Enter the asset request details.</p></div><button onClick={onClose}><X/></button></div>
    <form onSubmit={submit}><div className="form-grid">
      <label>Employee ID *<input value={form.employeeId} onChange={e=>setForm({...form,employeeId:e.target.value})} placeholder="EMP1024"/></label>
      <label>Employee Name *<input value={form.employee} onChange={e=>setForm({...form,employee:e.target.value})} placeholder="Employee name"/></label>
      <label>Asset Type *<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Laptop</option><option>Mouse</option><option>Keyboard</option><option>Charger</option></select></label>
      <label>Asset Number *<input value={form.assetNo} onChange={e=>setForm({...form,assetNo:e.target.value})} placeholder="AST-1001"/></label>
      <label className="full">Configuration *<input value={form.configuration} onChange={e=>setForm({...form,configuration:e.target.value})} placeholder="Enter configuration"/></label>
      <label>Date Required *<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label>
      <label>Allocated By<input value={form.allocatedBy} onChange={e=>setForm({...form,allocatedBy:e.target.value})}/></label>
    </div>{error && <div className="form-error">{error}</div>}<div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button className="primary" type="submit">Submit Request</button></div></form>
  </div></div>
}

export default App
