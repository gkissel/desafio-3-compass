import { UniqueEntityID } from './unique-entity-id'

describe('UniqueEntityID', () => {
  describe('toString', () => {
    it('should return the string representation of the unique entity ID', () => {
      const id = new UniqueEntityID('123')
      expect(id.toString()).toBe('123')
    })
  })

  describe('toValue', () => {
    it('should return the value of the unique entity ID', () => {
      const id = new UniqueEntityID('456')
      expect(id.toValue()).toBe('456')
    })
  })

  describe('equals', () => {
    it('should return true if two unique entity IDs are equal', () => {
      const id1 = new UniqueEntityID('789')
      const id2 = new UniqueEntityID('789')
      expect(id1.equals(id2)).toBe(true)
    })

    it('should return false if two unique entity IDs are not equal', () => {
      const id1 = new UniqueEntityID('111')
      const id2 = new UniqueEntityID('222')
      expect(id1.equals(id2)).toBe(false)
    })
  })
})
