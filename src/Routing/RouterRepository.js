import { makeObservable, observable } from 'mobx'
import { inject, injectable } from 'inversify'
import { Types } from '../Core/Types'
import { BooksRepository } from '../Books/BooksRepository'

@injectable()
export class RouterRepository {
  currentRoute = { routeId: null }

  @inject(BooksRepository)
  booksRepository

  @inject(Types.IRouterGateway)
  routerGateway

  onRouteChanged = null

  routes = [
    {
      routeId: 'loginLink',
      routeDef: {
        path: '/app/login',
        isSecure: false
      }
    },
    {
      routeId: 'homeLink',
      routeDef: {
        path: '/app/home',
        isSecure: true
      }
    },
    {
      routeId: 'booksLink',
      routeDef: {
        path: '/app/books',
        isSecure: true
      },
      onEnter: () => {
        this.booksRepository.load()
      },
      onLeave: () => {
        this.booksRepository.reset()
      }
    },
    {
      routeId: 'addBooksLink',
      routeDef: {
        path: '/app/books/add',
        isSecure: true
      }
    },
    {
      routeId: 'authorsLink',
      routeDef: {
        path: '/app/authors/',
        isSecure: true
      }
    },
    {
      routeId: 'authorsLink-authorPolicyLink',
      routeDef: {
        path: '/app/authors/policy',
        isSecure: false
      }
    },
    {
      routeId: 'authorsLink-mapLink',
      routeDef: {
        path: '/app/authors/map',
        isSecure: false
      }
    },
    {
      routeId: 'default',
      routeDef: {
        path: '*',
        isSecure: false
      },
      onEnter: () => {}
    }
  ]

  constructor() {
    makeObservable(this, {
      currentRoute: observable
    })
  }

  registerRoutes = (updateCurrentRoute, onRouteChanged) => {
    this.onRouteChanged = onRouteChanged
    let routeConfig = {}
    this.routes.forEach((routeArg) => {
      const route = this.findRoute(routeArg.routeId)
      routeConfig[route.routeDef.path] = {
        as: route.routeId,
        uses: (match) => {
          updateCurrentRoute(route.routeId, route.routeDef, {}, match.queryString)
        }
      }
    })

    this.routerGateway.registerRoutes(routeConfig)
  }

  findRoute(routeId) {
    const route = this.routes.find((route) => {
      return route.routeId === routeId
    })
    return route || { routeId: 'loadingSpinner', routeDef: { path: '' } }
  }

  goToId = async (routeId, params, query) => {
    this.routerGateway.goToId(routeId)
  }
}
