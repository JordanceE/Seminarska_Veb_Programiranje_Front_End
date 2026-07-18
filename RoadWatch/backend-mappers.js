export const ROAD_LAYOUT_TO_BACKEND = Object.freeze({
    "glavnaulica.png": "INTERSECTION",
    "roundabout-3-exits.png": "ROUNDABOUT_3_EXITS_1_LANE",
    "roundabout-3-exits-2-lanes.png": "ROUNDABOUT_3_EXITS_2_LANES",
    "roundabout-4-way-1-lanes.png": "ROUNDABOUT_4_EXITS_1_LANE",
    "roundabout-4-way-2-lanes.png": "ROUNDABOUT_4_EXITS_2_LANES",
    "t-junction.png": "T_JUNCTION",
    "boulevard_2_full_lines.png": "BOULEVARD_SOLID_MEDIAN",
    "boulevard_tree_line.png": "BOULEVARD_TREE_MEDIAN"
})

export const BACKEND_TO_ROAD_LAYOUT = Object.freeze(
    Object.fromEntries(
        Object.entries(ROAD_LAYOUT_TO_BACKEND).map(([sceneFile, roadLayout]) => [roadLayout, sceneFile])
    )
)

export const VEHICLE_TYPE_TO_BACKEND = Object.freeze({
    hatchback: "HATCHBACK",
    sedan: "SEDAN",
    coupe: "COUPE",
    wagon: "WAGON",
    suv: "SUV",
    mpv: "MINIVAN",
    pickup: "PICKUP",
    van: "VAN",
    truck: "TRUCK",
    motorcycle: "MOTORCYCLE",
    bus: "BUS"
})

export const BACKEND_TO_VEHICLE_TYPE = Object.freeze(
    Object.fromEntries(
        Object.entries(VEHICLE_TYPE_TO_BACKEND).map(([frontendType, backendType]) => [backendType, frontendType])
    )
)

export function toBackendRoadLayout(sceneFile) {
    const roadLayout = ROAD_LAYOUT_TO_BACKEND[sceneFile]
    if (!roadLayout) {
        throw new Error(`Unsupported road layout file: ${sceneFile}`)
    }
    return roadLayout
}

export function fromBackendRoadLayout(roadLayout) {
    const sceneFile = BACKEND_TO_ROAD_LAYOUT[roadLayout]
    if (!sceneFile) {
        throw new Error(`Unsupported backend road layout: ${roadLayout}`)
    }
    return sceneFile
}

export function mapVehicleType(type) {
    const backendType = VEHICLE_TYPE_TO_BACKEND[type]
    if (!backendType) {
        throw new Error(`Unsupported frontend vehicle type: ${type}`)
    }
    return backendType
}

export function backendTypeToFrontend(type) {
    return BACKEND_TO_VEHICLE_TYPE[type] || "sedan"
}

export function toBackendLocation(location) {
    return {
        fileName: location.file_name || null,
        name: location.name || null,
        description: location.desc || null,

        topRoadWidth: location.Top?.w ?? null,
        topRoadLanes: location.Top?.lanes ?? null,

        bottomRoadWidth: location.Bottom?.w ?? null,
        bottomRoadLanes: location.Bottom?.lanes ?? null,

        rightRoadWidth: location.Right?.w ?? null,
        rightRoadLanes: location.Right?.lanes ?? null,

        leftRoadWidth: location.Left?.w ?? null,
        leftRoadLanes: location.Left?.lanes ?? null,

        roundaboutDiameter: location.Roundabout ?? null,
        tJunction: Boolean(location.TJunction)
    }
}

export function fromBackendLocation(location, sceneFile) {
    return {
        scene_type: sceneFile,
        file_name: location.fileName || "",
        name: location.name || "",
        desc: location.description || "",

        Top: {
            w: location.topRoadWidth,
            lanes: location.topRoadLanes
        },
        Bottom: {
            w: location.bottomRoadWidth,
            lanes: location.bottomRoadLanes
        },
        Right: {
            w: location.rightRoadWidth,
            lanes: location.rightRoadLanes
        },
        Left: {
            w: location.leftRoadWidth,
            lanes: location.leftRoadLanes
        },

        Roundabout: location.roundaboutDiameter,
        TJunction: Boolean(location.tJunction)
    }
}

export function toBackendVehicle(car) {
    return {
        vehicleId: car.id,
        name: car.vehicleData.name,
        type: mapVehicleType(car.vehicleData.type),
        model: car.vehicleData.model || null,
        color: car.vehicleData.color || null,
        plate: car.vehicleData.plate || null,
        guilty: Boolean(car.vehicleData.guilty),
        comment: car.vehicleData.comment || null,

        position: {
            x: car.x,
            y: car.y
        },

        width: car.width,
        height: car.height,
        rotation: car.rotation,
        scale: car.scale,
        flipped: Boolean(car.flipped),
        note: car.note || null
    }
}

export function fromBackendVehicle(vehicle) {
    return {
        id: vehicle.vehicleId || crypto.randomUUID(),
        x: vehicle.position?.x ?? 0,
        y: vehicle.position?.y ?? 0,
        width: vehicle.width,
        height: vehicle.height,
        rotation: vehicle.rotation ?? 0,
        scale: vehicle.scale ?? 1,
        flipped: Boolean(vehicle.flipped),
        note: vehicle.note || "",
        confidence: null,
        vehicleData: {
            name: vehicle.name || "",
            model: vehicle.model || "",
            type: backendTypeToFrontend(vehicle.type),
            color: vehicle.color || "",
            plate: vehicle.plate || "",
            guilty: Boolean(vehicle.guilty),
            comment: vehicle.comment || ""
        }
    }
}

export function toBackendMeasurement(measurement) {
    return {
        measurementId: measurement.id,
        fromVehicleId: measurement.fromVehicleId,
        x1: measurement.x1,
        y1: measurement.y1,
        x2: measurement.x2,
        y2: measurement.y2,
        lengthMeters: measurement.len || 0,
        label: measurement.fromVehicleName || null
    }
}
