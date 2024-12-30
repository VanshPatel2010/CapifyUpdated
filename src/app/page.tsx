import Link from 'next/link'
import  {NavBar}  from '@/components/Navbar'
export default function Page() {


  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: '#000000',
    minHeight: '100vh',
    color: 'white'
  }

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: 'white'
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem'
  }

  const cardBaseStyle = {
    borderRadius: '0.75rem',
    padding: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    background: 'linear-gradient(145deg, rgba(26, 29, 36, 0.9), rgba(26, 29, 36, 0.6))'
  }

  const splitwiseCardStyle = {
    ...cardBaseStyle,
    background: 'linear-gradient(145deg, rgba(20, 184, 166, 0.2), rgba(26, 29, 36, 0.6))'
  }

  

  const cardTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: 'white'
  }

  const cardSubtitleStyle = {
    color: '#94a3b8',
    fontSize: '0.875rem'
  }

  const cardDescriptionStyle = {
    color: 'white',
    fontSize: '1rem'
  }

  const buttonStyle = {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-block',
    textDecoration: 'none',
    width: 'fit-content',
    fontSize: '0.875rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
  }

  

 

  return (
    
    <div style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
      
      <NavBar />
      <div style={containerStyle}>
      
        <h1 style={titleStyle}>Welcome to Your Budget App</h1>
        <div style={gridStyle}>
          {/* Budget Tracker Card */}
          <div style={cardBaseStyle}>
            <h2 style={cardTitleStyle}>Budget Tracker</h2>
            <p style={cardSubtitleStyle}>Manage your personal finances</p>
            <p style={cardDescriptionStyle}>Track your expenses, set budgets, and achieve your financial goals.</p>
            <Link href="/budget-tracker" style={buttonStyle}>
              Go to Budget Tracker
            </Link>
          </div>

          {/* Balance Tracker Card */}
          <div style={cardBaseStyle}>
            <h2 style={cardTitleStyle}>Balance Tracker</h2>
            <p style={cardSubtitleStyle}>Manage your personal finances</p>
            <p style={cardDescriptionStyle}>Track your expenses, set budgets, and achieve your financial goals.</p>
            <Link href="/balance" style={buttonStyle}>
              Go to Balance
            </Link>
          </div>

          {/* Splitwise Card */}
          <div style={splitwiseCardStyle}>
            <h2 style={cardTitleStyle}>Splitwise</h2>
            <p style={cardSubtitleStyle}>Split expenses with friends</p>
            <p style={cardDescriptionStyle}>Easily split bills, track shared expenses, and settle up with friends.</p>
            <Link href="/splitwise" style={buttonStyle}>
              Go to Splitwise
            </Link>
          </div>

          {/* Financial Resources Card */}
          
        </div>
      </div>
    </div>
  )
}

