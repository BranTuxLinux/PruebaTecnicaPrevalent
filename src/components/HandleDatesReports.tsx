import React, { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ApolloQueryResult } from "@apollo/client";
type IDate = {
  startDate: string;
  endDate: string;
};
interface IDatesReports {
  date: IDate;
  setDate: Dispatch<SetStateAction<IDate>>;
  handleRecharge: () => Promise<ApolloQueryResult<any>>
}
export const HandleDatesReports: React.FC<IDatesReports> = ({
  date,
  setDate,
  handleRecharge
}) => {

    // !NOTA AGREGAR UN FORMULARIO YA QUE CAMBIAR ALGO RECARGA TODA LA PAGINA
  return (
    <div className="grid grid-cols-2">
      <div className="col-span-3">
        <Label htmlFor="date">Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              {date.startDate ? format(date.startDate, "PPP") : "Pick a Start Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date.startDate ? new Date(date.startDate) : undefined}
              onSelect={(date) => {
                setDate((prev) => ({
                  ...prev,
                  startDate: new Date(date || new Date()).toISOString(),
                }));
              }}
              disabled={(date) =>
                date > new Date() || date < new Date("2000-01-01")
              }
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="col-span-3">
        <Label htmlFor="date">End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              {date.endDate ? format(date.endDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date.endDate ? new Date(date.endDate) : undefined}
              onSelect={(date) => {
                setDate((prev) => ({
                  ...prev,
                  endDate: new Date(date || new Date()).toISOString(),
                }));
              }}
              disabled={(date) =>
                date > new Date() || date < new Date("2000-01-01")
              }
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
