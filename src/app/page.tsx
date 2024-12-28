// import { NavBar } from '@/components/Navbar'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import Link from 'next/link'

// export default function Home() {
//   return (
//     <>
//       <NavBar />
//       <div className="container mx-auto p-4">
//         <h1 className="text-4xl font-bold mb-8">Welcome to Your Budget App</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Budget Tracker</CardTitle>
//               <CardDescription>Manage your personal finances</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <p className="mb-4">Track your expenses, set budgets, and achieve your financial goals.</p>
//               <Link href="/budget-tracker">
//                 <Button>Go to Budget Tracker</Button>
//               </Link>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle>Balance Tracker</CardTitle>
//               <CardDescription>Manage your personal finances</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <p className="mb-4">Track your expenses, set budgets, and achieve your financial goals.</p>
//               <Link href="/balance">
//                 <Button>Go to Balance</Button>
//               </Link>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle>Splitwise</CardTitle>
//               <CardDescription>Split expenses with friends</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <p className="mb-4">Easily split bills, track shared expenses, and settle up with friends.</p>
//               <Link href="/splitwise">
//                 <Button>Go to Splitwise</Button>
//               </Link>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle>Financial Resources</CardTitle>
//               <CardDescription>Learn about personal finance</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <p className="mb-4">Access articles and guides to improve your financial knowledge.</p>
//               <Link href="/resources">
//                 <Button>View Resources</Button>
//               </Link>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </>
//   )
// }

import { NavBar } from '@/components/Navbar'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8">Welcome to Your Budget App</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget Tracker Card */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">Budget Tracker</h2>
              <p className="text-gray-600 mb-4">Manage your personal finances</p>
              <p className="mb-4">Track your expenses, set budgets, and achieve your financial goals.</p>
              <Link href="/budget-tracker">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Go to Budget Tracker
                </button>
              </Link>
            </div>
          </div>

          {/* Balance Tracker Card */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">Balance Tracker</h2>
              <p className="text-gray-600 mb-4">Manage your personal finances</p>
              <p className="mb-4">Track your expenses, set budgets, and achieve your financial goals.</p>
              <Link href="/balance">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Go to Balance
                </button>
              </Link>
            </div>
          </div>

          {/* Splitwise Card */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">Splitwise</h2>
              <p className="text-gray-600 mb-4">Split expenses with friends</p>
              <p className="mb-4">Easily split bills, track shared expenses, and settle up with friends.</p>
              <Link href="/splitwise">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Go to Splitwise
                </button>
              </Link>
            </div>
          </div>

          {/* Financial Resources Card */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">Financial Resources</h2>
              <p className="text-gray-600 mb-4">Learn about personal finance</p>
              <p className="mb-4">Access articles and guides to improve your financial knowledge.</p>
              <Link href="/resources">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  View Resources
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
