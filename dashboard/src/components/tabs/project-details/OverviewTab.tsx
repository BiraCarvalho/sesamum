import React from "react";
import { MetricCard } from "../../shared/MetricCard";
import Card from "../../ui/Card";
import * as Progress from "@radix-ui/react-progress";
import { Building2, Users, Calendar } from "lucide-react";

interface OverviewTabProps {
  totalStaff: number;
  eventsStaff: Array<{
    name: string;
    staffCount: number;
  }>;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  totalStaff,
  eventsStaff,
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        title="Eventos no Projeto"
        value={5}
        icon={<Calendar />}
        color="event"
      />
      <MetricCard
        title="Empresas no Projeto"
        value={5}
        icon={<Building2 />}
        color="company"
      />
      <MetricCard
        title="Equipe no Projeto"
        value={42}
        icon={<Users />}
        color="user"
      />
    </div>

    <Card>
      <h2 className="text-xl font-semibold text-text-title mb-6">
        Conclusão dos eventos
      </h2>
      <div className="space-y-6">
        {/* Check-in Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-text-subtitle">
              Eventos Concluídos
            </label>
            <span className="text-sm font-semibold text-text-title">
              3 / 5 (60%)
            </span>
          </div>
          <Progress.Root
            className="relative overflow-hidden bg-slate-200 rounded-full w-full h-3"
            value={60}
          >
            <Progress.Indicator
              className="bg-green-500 h-full transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${100 - 60}%)` }}
            />
          </Progress.Root>
        </div>
      </div>
    </Card>

    <Card>
      <h2 className="text-xl font-semibold text-text-title mb-6">
        Staffs por eventos
      </h2>
      <div className="space-y-4">
        {eventsStaff.map((event, index) => {
          const percentage = (event.staffCount / totalStaff) * 100;
          return (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm font-medium text-text-title">
                    {event.name}
                  </p>
                </div>
                <span className="text-sm font-semibold text-text-title">
                  {event.staffCount} staffs
                </span>
              </div>
              <Progress.Root
                className="relative overflow-hidden bg-slate-200 rounded-full w-full h-2"
                value={percentage}
              >
                <Progress.Indicator
                  className="bg-primary h-full transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${100 - percentage}%)` }}
                />
              </Progress.Root>
            </div>
          );
        })}
      </div>
    </Card>
  </div>
);

export default OverviewTab;
