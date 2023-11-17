import { Fragment, useState, ReactNode, useEffect } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { CgPlayListAdd } from 'react-icons/cg'
import { MdFormatListBulleted, MdOutlineInventory } from 'react-icons/md'
import { BsBoxSeam } from 'react-icons/bs'
import { BiBarChartSquare, BiBell } from 'react-icons/bi'
import { FaRegUser, FaChevronDown, FaListUl } from 'react-icons/fa'
import { FiTruck } from 'react-icons/fi'
import { AiOutlinePlus } from 'react-icons/ai'
import { RxDashboard } from 'react-icons/rx'
import { LuListChecks, LuLayoutList } from 'react-icons/lu'
import { GrFormAdd } from 'react-icons/gr'
import { PiStackSimpleBold } from 'react-icons/pi'
import { IoPersonOutline } from 'react-icons/io5'
import {
    BellIcon,
    CalendarIcon,
    ChartBarIcon,
    FolderIcon,
    HomeIcon,
    InboxIcon,
    MenuAlt2Icon,
    UsersIcon,
    XIcon,
} from '@heroicons/react/outline'
import { SearchIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import { signOut } from "next-auth/react"


const userNavigation = [
    { name: 'Your Profile', href: '/account' },
    { name: 'Sign out', href: '#', onclick: () => signOut() },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Layout({ children }: { children: ReactNode }) {

    const router = useRouter()

    const isCurrentPage = (href: string) => {
        if (router.pathname === href) {
            return true
        } else {
            return false
        }
    }

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: RxDashboard, current: isCurrentPage(`/dashboard`) },
        { name: 'Brand Enroll', href: '/brand-enroll', icon: CgPlayListAdd, current: isCurrentPage(`/brand-enroll`) },
        { name: 'Inventory', href: '/inventory/products', icon: MdOutlineInventory, current: isCurrentPage(`/inventory  /products`), subNav: [{ name: 'Add Products', href: '/inventory/product-list', icon: AiOutlinePlus, current: isCurrentPage(`/inventory/product-list`) }, { name: 'Manage Products', href: '/inventory/products', icon: PiStackSimpleBold, current: isCurrentPage(`/inventory/products`) }, { name: 'Brand Listing', href: '/inventory/brand-listing', icon: LuLayoutList, current: isCurrentPage(`/inventory/brand-listing`) }, { name: 'Manage Brands', href: '/inventory/manage-brands', icon: LuListChecks, current: isCurrentPage(`/inventory/manage-brands`) }] },
        { name: 'Orders', href: '/orders', icon: BsBoxSeam, current: isCurrentPage(`/orders`) },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BiBarChartSquare, current: isCurrentPage(`/dashboard/analytics`) },
        { name: 'Shipping', href: '#', icon: FiTruck, current: isCurrentPage(`/shipping`) },
        { name: 'Account Info', href: '/account', icon: FaRegUser, current: isCurrentPage(`/account`) },
    ]

    // { name: 'Customers', href: '#', icon: IoPersonOutline, current: false }

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [openMenuName, setOpenMenuName] = useState('')

    function openSubMenu(menuName: string) {
        if (openMenuName == menuName) {
            setOpenMenuName('')
        } else {
            setOpenMenuName(menuName)
        }
    }

    useEffect(() => {
        if (router.pathname.includes("inventory")) {
            setOpenMenuName("Inventory")
        }

        if (router.pathname.includes("orders")) {
            setOpenMenuName("Orders")
        }

    }, [])

    return (
        <>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
            <div>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                        </Transition.Child>
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                                        <button
                                            type="button"
                                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <span className="sr-only">Close sidebar</span>
                                            <BiBell className="h-6 w-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="flex-shrink-0 flex items-center px-4">
                                    <img
                                        className="h-8 w-auto"
                                        src="/dashboard-logo.png"
                                        alt="Mybranz Logo"
                                    />
                                </div>
                                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                                    <nav className="px-2 space-y-1">
                                        {navigation.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className={classNames(
                                                    item.current
                                                        ? 'bg-gray-100 text-gray-900'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                                    'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                                                )}
                                            >
                                                <item.icon
                                                    className={classNames(
                                                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                                                        'mr-4 flex-shrink-0 h-6 w-6'
                                                    )}
                                                    aria-hidden="true"
                                                />
                                                {item.name}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </Transition.Child>
                        <div className="flex-shrink-0 w-14" aria-hidden="true">
                            {/* Dummy element to force sidebar to shrink to fit close icon */}
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 bg-[#212121] overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4 justify-center">
                            <img
                                className="h-8 w-auto"
                                src="/dashboard-logo.png"
                                alt="Workflow"
                            />
                        </div>
                        <hr className='mt-5  bg-white text-white mx-4' />
                        <div className="mt-5 flex-grow flex flex-col">
                            <nav className="flex-1 px-2 pb-4 space-y-1">
                                {navigation.map((item) => {
                                    return <div key={item.name}>
                                        <a href={item.href} className={classNames(
                                            item.current ? 'bg-[#f12d4d] text-white' : 'text-[#979797] hover:bg-[#f12d4d] hover:text-white',
                                            'group flex justify-start items-center px-2 py-2 text-sm font-medium rounded-md')}>

                                            <item.icon className={classNames(
                                                item.current ? 'text-white' : 'text-[#979797] group-hover:text-white',
                                                'mr-3 flex-shrink-0 h-6 w-6')} aria-hidden="true" /> {item.name}

                                            {item.subNav && <FaChevronDown onClick={(e) => {
                                                e.preventDefault()
                                                openSubMenu(item.name)
                                            }} className={classNames(
                                                item.current ? 'text-white' : 'text-[#979797] group-hover:text-white',
                                                'h-5 w-5 ml-auto')} aria-hidden="true" />}
                                        </a>

                                        <div className='submenu bg-[#111111] rounded-b-xl px-4'>
                                            {item?.subNav?.map((subItem) => {
                                                return <div key={subItem.name}>
                                                    {openMenuName == item.name && <a href={subItem.href} className={classNames(
                                                        subItem.current ? 'bg-[#f12d4d] text-white' : 'text-[#979797] hover:bg-[#f12d4d] hover:text-white',
                                                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md')}>

                                                        <subItem.icon className={classNames(
                                                            subItem.current ? 'text-white' : 'text-[#979797] group-hover:text-white',
                                                            'mr-3 flex-shrink-0 h-6 w-6 text-[#979797]')} aria-hidden="true" /> {subItem.name} </a>}
                                                </div>
                                            })}
                                        </div>
                                    </div>

                                })}
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="md:pl-60 flex flex-col flex-1">
                    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
                        <button
                            type="button"
                            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#f12d4d] md:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <BiBell className="h-6 w-6" aria-hidden="true" />
                        </button>
                        <div className="flex-1 px-4 flex justify-between">
                            <div className="flex-1 flex">
                                <form className="w-full flex md:ml-0" action="#" method="GET">
                                    <label htmlFor="search-field" className="sr-only">
                                        Search
                                    </label>
                                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                            <SearchIcon className="h-5 w-5" aria-hidden="true" />
                                        </div>
                                        <input
                                            id="search-field"
                                            className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                                            placeholder="Search"
                                            type="search"
                                            name="search"
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="ml-4 flex items-center md:ml-6">
                                <button
                                    type="button"
                                    className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f12d4d]"
                                >
                                    <span className="sr-only">View notifications</span>
                                    <BiBell className="h-6 w-6" aria-hidden="true" />
                                </button>

                                {/* Profile dropdown */}
                                <Menu as="div" className="ml-3 relative">
                                    <div>
                                        <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f12d4d]">
                                            <span className="sr-only">Open user menu</span>
                                            <img
                                                className="h-8 w-8 rounded-full"
                                                src="https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
                                                alt=""
                                            />
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            {userNavigation.map((item) => (
                                                <Menu.Item key={item.name}>
                                                    {({ active }) => (
                                                        <a
                                                            href={item.href}
                                                            className={classNames(
                                                                active ? 'bg-gray-100' : '',
                                                                'block px-4 py-2 text-sm text-gray-700'
                                                            )}
                                                        >
                                                            {item.name}
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    <main className="flex-1 bg-[#f9f9f9] h-screen">
                        {children}
                    </main>
                </div>
            </div>
        </>
    )
}
