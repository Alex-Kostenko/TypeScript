import { Subscriber, Unsubscriber } from '../types'

class Subscription<T> {
  private subscribers: Array<Subscriber<T>> = []

  add (subscriber: Subscriber<T>): Unsubscriber {
    this.subscribers.push(subscriber)
    return () => this.remove(subscriber)
  }

  addAndNotify (subscriber: Subscriber<T>, value: T) {
    const usub = this.add(subscriber)
    subscriber(value)
    return usub
  }

  remove (removedSubscriber: Subscriber<T>): void {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== removedSubscriber)
  }

  notify (subject: T): void {
    this.subscribers.forEach(
      subscriber => subscriber(subject)
    )
  }
}

export default Subscription
