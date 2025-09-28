const PROJECT_ID = "eleutherios-mvp-3c717"
const API_KEY = "AIzaSyA3brwHpI2dGR2KPAsZyJcIIaONDc0UDkQ"

export class FirebaseREST {
  static async listDocuments(collection: string) {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}?key=${API_KEY}`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    return (data.documents || []).map((doc: any) => ({
      id: doc.name.split('/').pop(),
      ...this.convertFields(doc.fields || {})
    }))
  }
  
  static async setDocument(collection: string, documentId: string, data: any) {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${documentId}?key=${API_KEY}`
    
    const firestoreData = {
      fields: Object.entries(data).reduce((acc, [key, value]) => {
        acc[key] = this.convertValue(value)
        return acc
      }, {} as any)
    }
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(firestoreData)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return response.json()
  }
  
  static convertFields(fields: any) {
    const result: any = {}
    for (const [key, value] of Object.entries(fields)) {
      result[key] = this.extractValue(value as any)
    }
    return result
  }
  
  static extractValue(value: any) {
    if (value.stringValue !== undefined) return value.stringValue
    if (value.doubleValue !== undefined) return value.doubleValue
    if (value.booleanValue !== undefined) return value.booleanValue
    if (value.timestampValue !== undefined) return value.timestampValue
    return null
  }
  
  static convertValue(value: any): any {
    if (typeof value === 'string') return { stringValue: value }
    if (typeof value === 'number') return { doubleValue: value }
    if (typeof value === 'boolean') return { booleanValue: value }
    return { stringValue: String(value) }
  }
}
