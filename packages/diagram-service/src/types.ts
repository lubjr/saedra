export type DiagramNode = {
    id: string
    label: string
    type: string
}

export type DiagramEdge = {
    from: string
    to: string
    relation?: string
}

export type DiagramGraph = {
    nodes: DiagramNode[]
    edges: DiagramEdge[]
}