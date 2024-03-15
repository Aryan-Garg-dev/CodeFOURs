export default function Event({event}){
    return (
    <div class="max-w-md mx-auto bg-white shadow-lg rounded-md overflow-hidden">
            <div class="p-4 bg-black">
                <div class="text-xl font-bold mb-2 text-white" id="club-name">{clubName}</div>
            </div>
            <div class="py-3 px-3 bg-gray-700">
                <div id="event-title" class="text-white font-semibold">
                    {event.title}
                </div>
            </div>
            <div class="py-3 px-3">
                <div id="event-date-time" class="text-sm text-gray-700">
                    {event.startTime}
                </div>
            </div>
            <div class="py-3 px-3">
                <div id="event-venue" class="text-sm text-gray-700">
                    {event.venue}
                </div>
            </div>
            <div class="py-3 px-3">
                <div id="event-description" class="text-sm text-gray-700">
                    {event.description}
                </div>
            </div>
        </div>
    )
}