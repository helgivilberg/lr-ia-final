import 'reflect-metadata'
import { NavigationPresenter } from './NavigationPresenter'
import { Router } from '../Routing/Router'
import { Types } from '../Core/Types'
import { AppTestHarness } from '../TestTools/AppTestHarness'
import { GetSuccessfulRegistrationStub } from '../TestTools/GetSuccessfulRegistrationStub'

let appTestHarness = null
let navigationPresenter = null
let router = null
let routerGateway = null

describe('navigation', () => {
    beforeEach(async () => {
        appTestHarness = new AppTestHarness()
        appTestHarness.init()
        appTestHarness.bootStrap(() => {})
        navigationPresenter = appTestHarness.container.get(NavigationPresenter)
        router = appTestHarness.container.get(Router)
        routerGateway = appTestHarness.container.get(Types.IRouterGateway)
    })

    describe('before login', () => {
        it('anchor default state', () => {
            expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('')
            expect(navigationPresenter.viewModel.showBack).toBe(false)
            expect(navigationPresenter.viewModel.menuItems).toEqual([])
        })
    })

    describe('login', () => {
        beforeEach(async () => {
            await appTestHarness.setupLogin(GetSuccessfulRegistrationStub, 'login')
        })
    })

    describe('basic navigation', () => {
        beforeEach(async () => {
            await appTestHarness.setupLogin(GetSuccessfulRegistrationStub, 'login')
        })

        it('should navigate down the navigation tree', async () => {
            // anchor in at the starting position
            expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('Home > homeLink')
            expect(navigationPresenter.viewModel.showBack).toBe(false)
            expect(navigationPresenter.viewModel.menuItems).toEqual([
                { id: 'booksLink', visibleName: 'Books' },
                { id: 'authorsLink', visibleName: 'Authors' }
            ])

            // move down one branch of the navigation system
            await router.goToId('authorsLink')

            // check that the navigation viewModel is rendered correctly
            expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('Authors > authorsLink')
            expect(navigationPresenter.viewModel.showBack).toBe(true)
            expect(navigationPresenter.viewModel.menuItems).toEqual([
                { id: 'authorsLink-authorPolicyLink', visibleName: 'Author Policy' },
                { id: 'authorsLink-mapLink', visibleName: 'View Map' }
            ])

            // then move down again
            await router.goToId('authorsLink-authorPolicyLink')

            // recheck the navigation viewModel
            expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe(
                'Author Policy > authorsLink-authorPolicyLink'
            )
        })

        it('should move back twice', async () => {
            // anchor in at the starting position
            expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('Home > homeLink')
            // expect(navigationPresenter.viewModel.showBack).toBe(false)
            // expect(navigationPresenter.viewModel.menuItems).toEqual([
            //     { id: 'booksLink', visibleName: 'Books' },
            //     { id: 'authorsLink', visibleName: 'Authors' }
            // ])

            // move down one branch of the navigation system
            await router.goToId('authorsLink')

            // check that the navigation viewModel is rendered correctly
            expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('Authors > authorsLink')
            // expect(navigationPresenter.viewModel.showBack).toBe(true)
            // expect(navigationPresenter.viewModel.menuItems).toEqual([
            //     { id: 'authorsLink-authorPolicyLink', visibleName: 'Author Policy' },
            //     { id: 'authorsLink-mapLink', visibleName: 'View Map' }
            // ])

            // then move down again
            await router.goToId('authorsLink-authorPolicyLink')

            // recheck the navigation viewModel
            expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe(
                'Author Policy > authorsLink-authorPolicyLink'
            )

            // new:
            // go back, twice
            await navigationPresenter.back()
            // went back one level:
            expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('Authors > authorsLink')

            // go back again
            await navigationPresenter.back()

            // should be at home again
            expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('Home > homeLink')


        })
    })
})
